const { User } = require('../models');
const bcrypt = require('bcrypt');
const DOMPurify = require('isomorphic-dompurify');

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
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }
    const { name, avatar_url, bio, email } = req.body;
    if (email !== undefined) {
      return res.status(400).json({ error: 'Email cannot be updated' });
    }
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
      }
      user.name = name;
    }
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (bio !== undefined) user.bio = DOMPurify.sanitize(bio);
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

exports.changeAvatar = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own avatar' });
    }
    const { avatar_url } = req.body;
    // Simple URL validation
    if (!avatar_url || typeof avatar_url !== 'string' || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)$/.test(avatar_url)) {
      return res.status(400).json({ error: 'Invalid avatar URL' });
    }
    user.avatar_url = avatar_url;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
}; 