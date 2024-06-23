import { Router, Request, Response } from 'express';
import Subscription from '../models/Subscription';
import User, { UserDocument } from '../models/User';
import auth from '../middleware/auth';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: UserDocument;
}


const router = Router();

// Route pour créer un nouvel abonnement
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, type, startDate, endDate, price } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const newSubscription = new Subscription({ userId, type, startDate, endDate, price });
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour obtenir tous les abonnements
router.get('/', async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find().populate('userId', 'username');
    res.json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour obtenir un abonnement par ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('userId', 'username');
    if (!subscription) return res.status(404).json({ msg: 'Subscription not found' });
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour mettre à jour un abonnement
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate, isActive, price } = req.body;
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { type, startDate, endDate, isActive, price },
      { new: true }
    );
    if (!updatedSubscription) return res.status(404).json({ msg: 'Subscription not found' });
    res.json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour supprimer un abonnement
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedSubscription) return res.status(404).json({ msg: 'Subscription not found' });
    res.json({ msg: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/choose', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { plan, duration, maxTrainings } = req.body;
    const user = await User.findById(req.user!._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.subscription && new Date(user.subscription.endDate) > new Date()) {
      return res.status(400).json({
        message: 'You already have an active subscription',
        plan: user.subscription.plan
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    user.subscription = {
      plan,
      startDate,
      endDate,
      maxTrainings,
      usedTrainings: 0
    };

    await user.save();
    res.status(200).json({ message: 'Subscription chosen successfully', subscription: user.subscription, user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
