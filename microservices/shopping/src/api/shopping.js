import ShoppingService from "../services/shopping-service.js"
import { publishCustomerEvent } from "../utils/publish-events.js";
import UserAuth from './middlewares/auth.js'

export default (app) => {

    const service = new ShoppingService();

    app.get('/', (req, res) => {
        res.send('Shopping Service is running');
    });

    app.post('/order', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;

        try {
            const { data } = await service.PlaceOrder({ _id, txnNumber });

            publishCustomerEvent('CREATE_ORDER', {
                userId: _id,
                order: data,
            });
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/orders', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {
            const { data } = await service.GetOrders(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });


    app.get('/cart', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        try {
            const { data } = await service.GetCart(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });
}