import { Router, Request, Response } from 'express';
import RevokedToken from '../models/RevokedToken';

const router = Router();

// Route pour révoquer un token (déconnexion)
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(400).json({ msg: 'No token provided' });

    const revokedToken = new RevokedToken({ token });
    await revokedToken.save();

    res.status(200).json({ msg: 'Token revoked, user logged out' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
