import ProductService from '../services/product-service.js';
import UserAuth from './middlewares/auth.js';
import { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY, PublishMessage } from '@packages/common/mq.js';

export default (app, channel) => {
    
    const service = new ProductService();

    app.post('/create', async(req,res,next) => {
        
        try {
            const { name, desc, type, unit,price, available, suplier, banner } = req.body; 
            // validation
            const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier, banner });
            return res.json(data);
            
        } catch (err) {
            next(err)    
        }
        
    });

    app.get('/category/:type', async(req,res,next) => {
        
        const type = req.params.type;
        
        try {
            const { data } = await service.GetProductsByCategory(type)
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/:id', async(req,res,next) => {
        
        const productId = req.params.id;

        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/ids', async(req,res,next) => {

        try {
            const { ids } = req.body;
            const products = await service.GetSelectedProducts(ids);
            return res.status(200).json(products);
            
        } catch (err) {
            next(err)
        }
       
    });
     
    app.put('/wishlist',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        
        try {
            const product = await service.GetProductById(req.body._id);

            PublishMessage(channel, CUSTOMER_BINDING_KEY, {
                event: 'ADD_TO_WISHLIST',
                data: {
                    userId: _id,
                    product,
                }
            });

            return res.status(200).send('ok');
        } catch (err) {
            
        }
    });
    
    app.delete('/wishlist/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const productId = req.params.id;

        try {
            const product = await service.GetProductById(productId);

            PublishMessage(channel, CUSTOMER_BINDING_KEY, {
                event: 'REMOVE_FROM_WISHLIST',
                data: {
                    userId: _id,
                    product,
                }
            });
            return res.status(200).send('ok');
        } catch (err) {
            next(err)
        }
    });


    app.put('/cart',UserAuth, async (req,res,next) => {
        
        const { _id, qty } = req.body;
        
        try {     
            const product = await service.GetProductById(_id);
    
            PublishMessage(channel, CUSTOMER_BINDING_KEY, {
                event: 'ADD_TO_CART',
                data: {
                    userId: req.user._id,
                    product,
                    qty
                }
            });
            PublishMessage(channel, SHOPPING_BINDING_KEY, {
                event: 'ADD_TO_CART',
                data: {
                    userId: req.user._id,
                    product,
                    qty
                }
            });
    
            return res.status(200).send('ok');
            
        } catch (err) {
            next(err)
        }
    });
    
    app.delete('/cart/:id',UserAuth, async (req,res,next) => {
        try {
            const product = await service.GetProductById(req.params.id);

            PublishMessage(channel, CUSTOMER_BINDING_KEY, {
                event: 'REMOVE_FROM_CART',
                data: {
                    userId: req.user._id,
                    product,
                    qty: 0
                }
            });
            PublishMessage(channel, SHOPPING_BINDING_KEY, {
                event: 'REMOVE_FROM_CART',
                data: {
                    userId: req.user._id,
                    product,
                    qty: 0
                }
            });

            return res.status(200).send('ok');
        } catch (err) {
            next(err)
        }
    });

    //get Top products and category
    app.get('/', async (req,res,next) => {
        //check validation
        try {
            const { data} = await service.GetProducts();        
            return res.status(200).json(data);
        } catch (error) {
            next(err)
        }
        
    });
    
}