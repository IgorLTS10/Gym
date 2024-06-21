import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import RevokedToken from '../models/RevokedToken';

interface AuthRequest extends Request {
  user?: any;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const revokedToken = await RevokedToken.findOne({ token });
    if (revokedToken) return res.status(401).json({ msg: 'Token has been revoked' });

    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

export default auth;
