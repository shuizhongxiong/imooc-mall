const mongoose = require('mongoose');

module.exports = {
  init: () => {
    mongoose.connect('mongodb://localhost/demo_mall', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', () => {
      console.log('MongoDB connected fail.');
    });

    db.on('open', () => {
      console.log('MongoDB connected success.');
    });
  },
};
