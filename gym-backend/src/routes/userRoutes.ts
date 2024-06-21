import { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Route d'inscription
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route de connexion
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour obtenir tous les utilisateurs
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour obtenir un utilisateur par nom d'utilisateur
router.get('/:username', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour modifier un utilisateur
router.put('/:username', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, height, weight, age, gender, bio } = req.body;
    let updateData: any = { username, email, role, height, weight, age, gender, bio };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      updateData,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour supprimer un utilisateur
router.delete('/:username', async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findOneAndDelete({ username: req.params.username });
    if (!deletedUser) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;