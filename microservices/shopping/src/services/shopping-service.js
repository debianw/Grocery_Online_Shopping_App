import { ShoppingRepository } from "../database/index.js";
import { FormateData } from "../utils/index.js";
import { APIError } from "../utils/app-errors.js";
import { SHOPPING_BINDING_KEY, SubscribeToChannel } from "@packages/common/mq.js";

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs
    // check transaction for payment Status

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(customerId, product, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        product,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetCart(customerId) {
    try {
      const cart = await this.repository.GetCart(customerId);
      return FormateData(cart);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      console.log(err);
      throw new APIError("Data Not found", err);
    }
  }

  async SubscribeEvents(payload) {

    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case 'ADD_TO_CART':
        this.ManageCart(userId, product, qty, false);
        break;
      case 'REMOVE_FROM_CART':
        this.ManageCart(userId, product, qty, true);
        break;
      case 'TEST_EVENT':
        console.log('Test event received:', data);
        break;
      default:
        break;
    }
  }

  async SubscribeToChannel(channel) {
    SubscribeToChannel(channel, SHOPPING_BINDING_KEY, payload => {
      const { event, data } = payload;
      console.log('Received data in Shopping Service:', event);
      console.log('Data:', data);

      this.SubscribeEvents(payload);
    })
  }
}

export default ShoppingService;
