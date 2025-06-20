const { User } = require('../models');
const { isValidUrl } = require('../utils/validators');
const { Op } = require('sequelize');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
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
    if (name) updateFields.name = name;
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
      updateFields.email = email;
    }

    await user.update(updateFields);
    const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_url } = req.body;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized
    if (user.id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own avatar' });
    }

    // Validate avatar URL
    if (!avatar_url || !isValidUrl(avatar_url)) {
      return res.status(403).json({ error: 'Invalid avatar URL' });
    }

    // Avatar updates are not allowed in this version
    return res.status(403).json({ error: 'Avatar updates are not allowed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 