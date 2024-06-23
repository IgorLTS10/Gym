import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Cours from '../models/Cours';
import auth from '../middleware/auth';
import { UserDocument } from '../models/User';
import User from '../models/User';
import History from '../models/History';

interface AuthRequest extends Request {
    user?: UserDocument;
  }

const router = Router();

// Route pour ajouter un nouveau cours
router.post('/', async (req: Request, res: Response) => {
  try {
    const { date, time, title, duration, coach, description, capacity } = req.body;
    const newCours = new Cours({ date, time, title, duration, coach, description, capacity });
    await newCours.save();
    res.status(201).json(newCours);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour obtenir tous les cours
router.get('/', async (req: Request, res: Response) => {
    try {
      const cours = await Cours.find();
      res.json(cours);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

// Route pour obtenir un cours par ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ msg: 'Course not found' });
    res.json(cours);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour mettre à jour un cours
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { date, time, title, duration, coach, description, capacity } = req.body;
    const updatedCours = await Cours.findByIdAndUpdate(
      req.params.id,
      { date, time, title, duration, coach, description, capacity },
      { new: true }
    );
    if (!updatedCours) return res.status(404).json({ msg: 'Course not found' });
    res.json(updatedCours);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour supprimer un cours
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedCours = await Cours.findByIdAndDelete(req.params.id);
    if (!deletedCours) return res.status(404).json({ msg: 'Course not found' });
    res.json({ msg: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour inscrire un utilisateur à un cours
router.post('/:coursId/subscribe', auth, async (req: AuthRequest, res: Response) => {
  try {
    const cours = await Cours.findById(req.params.coursId);
    if (!cours) return res.status(404).json({ msg: 'Cours not found' });

    const userId = req.user!._id as unknown as mongoose.Types.ObjectId;

    if (cours.participants.includes(userId)) {
      return res.status(400).json({ msg: 'Already subscribed' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.subscription && new Date(user.subscription.endDate) > new Date()) {
      if (user.subscription.usedTrainings >= user.subscription.maxTrainings) {
        return res.status(400).json({ message: 'You have reached your maximum number of trainings for this period' });
      }

      cours.participants.push(userId);
      cours.capacity -= 1;
      user.subscription.usedTrainings += 1;

      await cours.save();
      await user.save();

      // Enregistrer l'événement dans l'historique
      const history = new History({
        user: userId,
        event: 'Cours Inscription',
        details: `Inscrit au cours: ${cours.title} le ${cours.date}`,
      });
      await history.save();

      res.json(cours);
    } else {
      return res.status(400).json({ message: 'You do not have an active subscription' });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour désinscrire un utilisateur d'un cours
router.post('/:coursId/unsubscribe', auth, async (req: AuthRequest, res: Response) => {
  try {
    const cours = await Cours.findById(req.params.coursId);
    if (!cours) return res.status(404).json({ msg: 'Cours not found' });

    const userId = req.user!._id as unknown as mongoose.Types.ObjectId;

    if (!cours.participants.includes(userId)) {
      return res.status(400).json({ msg: 'Not subscribed' });
    }

    cours.participants = cours.participants.filter(participant => participant.toString() !== userId.toString());
    cours.capacity += 1;

    const user = await User.findById(userId);
    if (user && user.subscription) {
      user.subscription.usedTrainings -= 1;
      await user.save();
    }

    await cours.save();

    // Enregistrer l'événement dans l'historique
    const history = new History({
      user: userId,
      event: 'Cours Désinscription',
      details: `Désinscrit du cours: ${cours.title} le ${cours.date}`,
    });
    await history.save();

    res.json(cours);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});


// Route pour inscrire un utilisateur à un cours avec vérification de l'abonnement
router.post('/:id/subscribe', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    const cours = await Cours.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!cours) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (user.subscription && new Date(user.subscription.endDate) > new Date()) {
      if (user.subscription.usedTrainings >= user.subscription.maxTrainings) {
        return res.status(400).json({ message: 'You have reached your maximum number of trainings for this period' });
      }

      const userId = user._id.toString();

      if (cours.participants.some(participant => participant.toString() === userId)) {
        return res.status(400).json({ message: 'You are already subscribed to this course' });
      }

      cours.participants.push(new mongoose.Types.ObjectId(userId));
      user.subscription.usedTrainings += 1;

      await cours.save();
      await user.save();

      res.status(200).json({ 
        message: 'Subscribed successfully', 
        subscription: user.subscription 
      });
    } else {
      return res.status(400).json({ message: 'You do not have an active subscription' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Route pour désinscrire un utilisateur d'un cours avec vérification de l'abonnement
router.post('/:id/unsubscribe', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    const cours = await Cours.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!cours) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userId = user._id.toString();

    if (cours.participants.some(participant => participant.toString() === userId)) {
      cours.participants = cours.participants.filter(participant => participant.toString() !== userId);
      user.subscription!.usedTrainings -= 1;

      await cours.save();
      await user.save();

      res.status(200).json(cours);
    } else {
      return res.status(400).json({ message: 'You are not subscribed to this course' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
