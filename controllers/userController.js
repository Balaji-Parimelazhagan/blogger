const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Check for existing email
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // Return user (no password)
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}; 