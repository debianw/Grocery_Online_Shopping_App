export default app => {
  app.use('/app-events', async (req, res, next) => {
    const { body: { payload } } = req;
    console.log('=== Subscribed to customer events ===');
    res.send('Webhook received successfully');
  })
}