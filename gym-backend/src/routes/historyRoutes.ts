import { Router, Request, Response } from 'express';
import History from '../models/History';
import auth from '../middleware/auth';
import { UserDocument } from '../models/User';

interface AuthRequest extends Request {
  user?: UserDocument;
}

const router = Router();

// Route pour obtenir l'historique d'un utilisateur
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const history = await History.find({ user: req.user!._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour obtenir l'historique de tous les utilisateurs
router.get('/all', auth, async (req: AuthRequest, res: Response) => {
    try {
      const history = await History.find().populate('user', 'username email').sort({ date: -1 });
      res.json(history);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

export default router;
