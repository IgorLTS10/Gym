# Gym Management Application
A modern web application for managing gym memberships, user profiles, and subscriptions, built with React, TypeScript, Express, and MongoDB.

## Table of Contents
- Features
- Tech Stack
- Getting Started
- API Endpoints
- Project Structure
- Contributing
- License

## Features
- User registration and authentication
- Admin dashboard for managing users and subscriptions
- User profile management with customizable characteristics
- Subscription plans with different pricing options
- Responsive design with modern UI/UX

## Tech Stack
- Frontend: React, TypeScript, CSS (with modern styling)
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- Tooling: Nodemon for backend auto-reload

## Getting Started
### Prerequisites
- Node.js and npm installed
- MongoDB instance running

### Installation
1. Clone the repository:

```
git clone https://github.com/IgorLTS10/Gym
cd Gym
```
2. Install dependencies for both frontend and backend:

```
# Install backend dependencies
cd gym-backend
npm install


# Install frontend dependencies
cd ../gym-frontend
npm install
```
### Running the Application
1. Start the backend server:

``` 
cd gym-backend
npm run nodemon or npm run dev
```
2. Start the frontend development server:

```
cd ../gym-frontend
npm start
```

3. Open your browser and navigate to http://localhost:3000 to view the application.

## API Endpoints
### Auth Routes
- POST /api/users/register

   - Registers a new user.
   - Request body: { "username": "user1", "email": "user1@example.com", "password": "password123", "role": "member" }
- POST /api/users/login

   - Logs in a user and returns a JWT token.
   - Request body: { "username": "user1", "password": "password123" }
- GET /api/users/me
   - Retrieves the authenticated user's profile.
   - Requires JWT token in Authorization header: Bearer <token>
### User Routes
- GET /api/users

   - Retrieves a list of all users.
   - Admin access required.
- GET /api/users/
   - Retrieves a user by username.
- PUT /api/users/

   - Updates a user's profile.
   - Request body can include: username, email, password, role, height, weight, age, gender, bio
- DELETE /api/users/

   - Deletes a user by username.
   - Admin access required.
### Subscription Routes
- POST /api/subscriptions

   - Creates a new subscription.
   - Request body: { "userId": "user_id", "plan": "monthly", "price": 29.99 }
- GET /api/subscriptions

   - Retrieves a list of all subscriptions.
   - Admin access required.
- GET /api/subscriptions/

   -  Retrieves a subscription by ID.
- PUT /api/subscriptions/

   - Updates a subscription.
   - Request body can include: plan, price
- DELETE /api/subscriptions/

   - Deletes a subscription by ID.
   - Admin access required.
## Project Structure
```
Gym/
├── gym-backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── server.ts
│   │   └── ...
│   ├── package.json
│   └── ...
└── gym-frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── ...
    ├── package.json
    └── ...
```
