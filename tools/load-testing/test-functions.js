module.exports = {
  setVariant: function(context, events, done) {
    context.vars.variant = Math.random() > 0.5 ? 'A' : 'B';
    return done();
  }
};
