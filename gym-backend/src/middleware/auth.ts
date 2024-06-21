import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/User';

interface AuthRequest extends Request {
  user?: UserDocument;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  console.log('Token received:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded: any = jwt.verify(token, 'yourjwtsecret');  // Assurez-vous que 'your_jwt_secret' est correct
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found for decoded ID:', decoded.id);
      return res.status(401).json({ msg: 'User not found' });
    }
    console.log('User found:', user);

    req.user = user;
    next();
  } catch (err) {
    console.log('Token is not valid:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;
