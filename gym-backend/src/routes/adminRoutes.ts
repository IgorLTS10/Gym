import { Router, Request, Response } from 'express';
import User from '../models/User';
import auth from '../middleware/auth';
import { UserDocument } from '../models/User';

const router = Router();

interface AuthRequest extends Request {
  user?: UserDocument;
}

// Route pour obtenir tous les utilisateurs avec leurs abonnements
router.get('/subscriptions', auth, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ subscription: { $exists: true } }).select('username email subscription');
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour promouvoir un utilisateur au rôle de coach
router.put('/promote/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'coach' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
