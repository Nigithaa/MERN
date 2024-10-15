const express = require('express');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const router = express.Router();

router.post('/', async (req, res) => {
  const { id, name, date, flowers, totalAmount } = req.body;


  try {
    let user = await User.findOne({ id });
    if (!user) {
      user = new User({ id, name, date });
      await user.save();
    }

    const order = new Order({
      userId: id,
      flowers,
      totalAmount,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
