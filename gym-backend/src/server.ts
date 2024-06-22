import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import coursRoutes from './routes/coursRoutes';
import historyRoutes from './routes/historyRoutes'; // Import des routes d'historique
import adminRoutes from './routes/adminRoutes'; // Import des routes admin

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares

app.use(cors());
app.use(express.json());

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/history', historyRoutes); // Utilisation des routes d'historique
app.use('/api/admin', adminRoutes); // Utilisation des routes admin

// MongoDB connection
mongoose.connect('mongodb+srv://igor:azerty@gym.yb68jhd.mongodb.net/', {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
