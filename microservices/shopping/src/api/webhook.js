import ShoppingService from '../services/shopping-service.js';

export default app => {
  const service = new ShoppingService();

  app.use('/app-events', async (req, res, next) => {
    const { body: { payload } } = req;
    console.log('=== Received webhook event ===', payload);

    // Process the webhook event
    await service.SubscribeEvents(payload);

    res.send('Event received successfully');
  })
}