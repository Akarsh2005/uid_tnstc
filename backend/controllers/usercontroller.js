import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.emailId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const registerUser = async (req, res) => {
  const { name, emailId, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ emailId });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, emailId, password, phone });
    const token = generateToken(newUser);

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        emailId: newUser.emailId,
        role: newUser.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  const { emailId, password } = req.body;

  const user = await User.findOne({ emailId });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // ✅ Return _id, name, email, role
  res.status(200).json({
    _id: user._id,
    name: user.name,
    emailId: user.emailId,
    role: user.role
  });
};


export const logoutUser = (req, res) => {
  res.json({ message: 'Logout successful (remove token on client)' });
};
