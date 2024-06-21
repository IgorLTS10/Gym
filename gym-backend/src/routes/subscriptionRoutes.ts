import { Router, Request, Response } from 'express';
import Subscription from '../models/Subscription';
import User from '../models/User';

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

export default router;
