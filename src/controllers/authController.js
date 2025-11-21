import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // For simplified auth, just check if email exists or create user
    // In production, you'd want proper password authentication
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create user with default password if email-based auth is used
      const defaultPassword = password || 'default-password-123';
      user = new User({ email: email.toLowerCase(), password: defaultPassword });
      await user.save();
    } else if (password) {
      // If password provided, verify it
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    const token = generateToken(user);

    // Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('email', user.email, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.clearCookie('email');
  res.json({ message: 'Logout successful' });
}

