export const publishCustomerEvent = (eventName, data) => {
    const event = {
      payload: {
        event: eventName,
        data,
      }
    };

    // Here you would typically publish the event to a message broker or event bus
    // For example, using a message queue like RabbitMQ or Kafka
    console.log(`Publishing customer event: ${eventName}`, data);
    
    // Simulate publishing the event
    // In a real application, you would replace this with actual publishing logic

    fetch('http://localhost:9000/customer/app-events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
    }).catch(err => {
        console.error('Error publishing event:', err);
    });
}