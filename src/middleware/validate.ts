import { Request, Response, NextFunction } from 'express';

export const validateSignup = (req: Request, res: Response, next: NextFunction): void => {
  const { email, username, password, dob } = req.body;

  if (!email || !username || !password || !dob) {
    res.status(400).json({ error: 'All fields (email, username, password, dob) are required.' });
    return;
  }

  // Basic regex validation for security
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format.' });
    return;
  }

  if (username.length < 3 || username.length > 20) {
    res.status(400).json({ error: 'Username must be between 3 and 20 characters.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  // Legal COPPA/GDPR Age Compliance Check (Under 13 restriction example)
  const birthDate = new Date(dob);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (isNaN(birthDate.getTime()) || age < 13) {
    res.status(400).json({ error: 'You must be at least 13 years old to register.' });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ error: 'Identifier (Email/Username) and password are required.' });
    return;
  }

  next();
};