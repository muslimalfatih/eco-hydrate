module.exports = {
  // Generate realistic product IDs for testing
  generateProductId: function(context, events, done) {
    const productIds = [
      'eco-classic-001',
      'eco-pro-002', 
      'eco-sport-003',
      'eco-mini-004',
      'eco-xl-005'
    ];
    context.vars.productId = productIds[Math.floor(Math.random() * productIds.length)];
    return done();
  },

  // Track response times
  measureResponseTime: function(requestParams, response, context, events, done) {
    const responseTime = response.elapsedTime || 0;
    
    if (responseTime > 200) {
      console.log(`⚠️  Slow response: ${requestParams.url} - ${responseTime}ms`);
    }
    
    // Track in custom metrics
    events.emit('customStat', 'response_time', responseTime);
    return done();
  },

  // Log errors for debugging
  logErrors: function(requestParams, response, context, events, done) {
    if (response.statusCode >= 400) {
      console.log(`❌ Error ${response.statusCode}: ${requestParams.url}`);
      console.log(`   Response: ${response.body ? response.body.substring(0, 200) : 'No body'}`);
    }
    return done();
  },

  // Simulate realistic user behavior
  addRealisticDelay: function(context, events, done) {
    // Random delay between 100ms - 2s (realistic user behavior)
    const delay = Math.random() * 1900 + 100;
    setTimeout(done, delay);
  },

  // Generate realistic order data
  generateOrderData: function(context, events, done) {
    const products = [
      { name: 'Eco-Hydrate Classic', price: 29.99 },
      { name: 'Eco-Hydrate Pro', price: 39.99 },
      { name: 'Eco-Hydrate Sport', price: 34.99 }
    ];
    
    const product = products[Math.floor(Math.random() * products.length)];
    context.vars.productName = product.name;
    context.vars.unitPrice = product.price;
    context.vars.quantity = Math.floor(Math.random() * 3) + 1;
    
    return done();
  }
};
