import ProductService from '../services/product-service.js';
import UserAuth from './middlewares/auth.js'
import { publishCustomerEvent, publishShoppingEvent } from '../utils/publish-events.js';

export default (app) => {
    
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

            publishCustomerEvent('ADD_TO_WISHLIST', {
                userId: _id,
                product,
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
            publishCustomerEvent('REMOVE_FROM_WISHLIST', {
                userId: _id,
                product,
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
    
            publishCustomerEvent('ADD_TO_CART', {
                userId: req.user._id,
                product,
                qty
            });
            publishShoppingEvent('ADD_TO_CART', {
                userId: req.user._id,
                product,
                qty
            });
    
            return res.status(200).send('ok');
            
        } catch (err) {
            next(err)
        }
    });
    
    app.delete('/cart/:id',UserAuth, async (req,res,next) => {
        try {
            const product = await service.GetProductById(req.params.id);
            publishCustomerEvent('REMOVE_FROM_CART', {
                userId: req.user._id,
                product,
                qty: 0,
            });
            publishShoppingEvent('REMOVE_FROM_CART', {
                userId: req.user._id,
                product,
                qty: 0,
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