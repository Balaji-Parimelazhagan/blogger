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

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { name, avatar_url, bio } = req.body;
    if (name !== undefined) user.name = name;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (bio !== undefined) user.bio = bio;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}; 