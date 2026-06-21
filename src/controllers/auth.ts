import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, dob } = req.body;

    // Check collision system-wide
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({ error: 'Email or Username is already registered.' });
      return;
    }

    // Hash with a secure work factor (Salt rounds = 12)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      username,
      passwordHash,
      dob: new Date(dob)
    });

    await newUser.save();

    // Do not return passwordHash back to consumer
    res.status(201).json({
      message: 'User registered successfully.',
      user: { id: newUser._id, email: newUser.email, username: newUser.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    // Unified input login system
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    // Success response stub (Session / Token strategy configured in Phase 2)
    res.status(200).json({
      message: 'Login successful.',
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};