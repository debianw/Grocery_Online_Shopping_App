import { v4 as uuidv4 } from 'uuid';
import { CartModel, OrderModel } from '../models/index.js';
import { APIError, BadRequestError, STATUS_CODES } from '../../utils/app-errors.js'


//Dealing with data base operations
class ShoppingRepository {

    // payment

    async Orders(customerId) {
        try {
            const orders = await OrderModel.find({ customerId });
            return orders;
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
        }
    }

    async GetCart(customerId) {
        try {
            const cart = await CartModel.findOne({ customerId });
            if (!cart) {
                return [];
            }
            return cart;
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Cart')
        }
    }

    async AddCartItem(customerId, product, qty, isRemove) {
        try {
            let cart = await CartModel.findOne({ customerId });

            if (!cart) {
                cart = new CartModel({
                    customerId,
                    items: [{
                        product,
                        unit: qty,
                    }],
                });
                return cart.save();
            }

            const cartItem = {
                product,
                unit: qty,
            };

            let cartItems = cart.items || [];

            if (cartItems.length > 0) {
                let isExist = false;
                cartItems.map((item) => {
                    if (item.product._id.toString() === product._id.toString()) {
                        if (isRemove) {
                            cartItems.splice(cartItems.indexOf(item), 1);
                        } else {
                            item.unit = qty;
                        }
                        isExist = true;
                    }
                });

                if (!isExist) {
                    cartItems.push(cartItem);
                }
            } else {
                cartItems.push(cartItem);
            }

            cart.items = cartItems;

            const cartSaveResult = await cart.save();
            return cartSaveResult;

        } catch (err) {
            console.error(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to add to cart"
            );
        }
    }

    async CreateNewOrder(customerId, txnId) {
        try {
            const cart = await CartModel.findOne({ customerId });

            if (cart) {

                let amount = 0;

                let cartItems = cart.items || [];

                if (cartItems.length > 0) {
                    //process Order
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) * parseInt(item.unit);
                    });

                    const orderId = uuidv4();

                    const order = new OrderModel({
                        orderId,
                        customerId,
                        amount,
                        txnId,
                        status: 'received',
                        items: cartItems
                    })

                    cart.items = [];

                    const orderResult = await order.save();
                    await cart.save();

                    return orderResult;
                }
            }

            return {}

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }


    }
}

export default ShoppingRepository;