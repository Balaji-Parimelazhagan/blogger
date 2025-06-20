const { User } = require('../models');
const bcrypt = require('bcryptjs');
const DOMPurify = require('isomorphic-dompurify');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check for max length
    if (name.length > 100) {
      return res.status(400).json({ error: 'Name too long (max 100 characters)' });
    }
    if (email.length > 255) {
      return res.status(400).json({ error: 'Email too long (max 255 characters)' });
    }
    if (password.length > 100) {
      return res.status(400).json({ error: 'Password too long (max 100 characters)' });
    }

    // Check for SQL injection/XSS patterns
    const suspicious = /('|--|;|<script>)/i;
    if (suspicious.test(name) || suspicious.test(email)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check for duplicate email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Check for duplicate username
    const existingName = await User.findOne({ where: { name } });
    if (existingName) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: DOMPurify.sanitize(name),
      email: email.toLowerCase(),
      password: hashedPassword,
      status: 'active'
    });

    // Return user without password
    const userWithoutPassword = await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await User.findByPk(userId);
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
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    let tokenPayload;
    try {
      tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!tokenPayload || !tokenPayload.id || tokenPayload.id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, avatar_url, bio } = req.body;

    // Validate input
    if (name !== undefined) {
      if (name.length === 0) {
        return res.status(400).json({ error: 'Name cannot be empty' });
      }
      if (name.length > 100) {
        return res.status(400).json({ error: 'Name too long (max 100 characters)' });
      }
      user.name = name;
    }

    if (avatar_url !== undefined) {
      if (avatar_url.length > 255) {
        return res.status(400).json({ error: 'Avatar URL too long (max 255 characters)' });
      }
      // Basic URL validation
      try {
        new URL(avatar_url);
        user.avatar_url = avatar_url;
      } catch (err) {
        return res.status(400).json({ error: 'Invalid avatar URL format' });
      }
    }

    if (bio !== undefined) {
      // Sanitize bio to prevent XSS
      user.bio = DOMPurify.sanitize(bio);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.changeAvatar = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId) || userId < 1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own avatar' });
    }

    const { avatar_url } = req.body;
    if (!avatar_url) {
      return res.status(400).json({ error: 'Avatar URL is required' });
    }

    try {
      new URL(avatar_url);
    } catch {
      return res.status(400).json({ error: 'Invalid avatar URL' });
    }

    user.avatar_url = avatar_url;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized
    if (user.id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    const updateFields = {};
    if (name) {
      // Check for SQL injection/XSS patterns
      const suspicious = /('|--|;|<script>)/i;
      if (suspicious.test(name)) {
        return res.status(400).json({ error: 'Invalid input' });
      }
      updateFields.name = DOMPurify.sanitize(name);
    }

    if (email) {
      // Check if email is already in use
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id }
        }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      updateFields.email = email.toLowerCase();
    }

    await user.update(updateFields);
    const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (req.user.id !== parseInt(id, 10)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
}; 