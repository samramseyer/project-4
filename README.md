# TechHelp Hub - Q&A Forum Platform

A complete three-tier Q&A forum application built with the MERN stack (MongoDB, Express.js, React, Node.js). Users can register, login, ask questions, provide answers, vote on content, and build reputation in the community.

## 🔗 Links

- **GitHub Repository:** [https://github.com/samramseyer/project-4](https://github.com/samramseyer/project-4)
- **Live Demo:** [https://samramseyer.github.io/project-4/](https://samramseyer.github.io/project-4/)
- **Documentation:** See below for complete setup and usage instructions

## 🎯 Application Theme

**TechHelp Hub** is a Q&A forum for programming and technology questions organized into focused categories:

- **JavaScript** - Questions about JavaScript, ES6+, and modern JS features
- **Python** - Python programming, Django, Flask, and data science
- **React** - React.js, hooks, state management, and components
- **Database** - SQL, MongoDB, PostgreSQL, and database design
- **Node.js** - Node.js, Express, and backend development

## 📋 Architecture

### Data Layer

- **Database:** MongoDB
- **ODM:** Mongoose
- **Models:** User, Question, Answer, Category
- **Features:**
  - Schema validation and relationships
  - User authentication with JWT
  - Vote tracking (upvotes/downvotes)
  - Reputation system
  - Accepted answers

### Application Layer (Backend)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt hashing
- **Features:**
  - RESTful JSON API
  - Protected routes with authentication middleware
  - CRUD operations for all resources
  - Vote handling
  - Error handling and validation

### Presentation Layer (Frontend)

- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios with interceptors
- **State Management:** React Context API for authentication
- **Features:**
  - Single Page Application (SPA)
  - Component-based architecture
  - Real-time authentication state
  - Responsive design
  - Form validation

## 🚀 Features

### User Management

- User registration and login
- JWT-based authentication
- Profile with reputation points
- Session persistence

### Forum Features

- **Ask Questions** - Post questions with title, body, category, and tags
- **Answer Questions** - Provide detailed answers to help others
- **Vote System** - Upvote/downvote questions and answers
- **Accept Answers** - Question authors can mark the best answer
- **Categories** - Browse questions by technology category
- **Search & Filter** - Search questions and filter by category/sort
- **View Tracking** - Track question views
- **Reputation System** - Earn points through participation

### User Interface

- Modern, responsive design
- Category-based navigation
- Real-time vote updates
- Syntax-friendly answer formatting
- User authentication status display
- Mobile-friendly layout

## 🛠️ Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **npm** package manager

## 📥 Installation

### 1. Navigate to the Project

```bash
cd c:\Users\mrram\Desktop\gitrepo\project-4
```

### 2. Install All Dependencies

From the root directory:

```bash
npm run install-all
```

Or install individually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB** on your system
2. **Start MongoDB service** (usually runs automatically)
3. **Verify connection** in `server/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/techhelphub
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Add your IP address to the whitelist
4. Create a database user
5. Get your connection string
6. Update `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/techhelphub?retryWrites=true&w=majority
   ```

### Seed the Database with Example Data

After setting up MongoDB, seed the database with sample categories, users, questions, and answers:

```bash
cd server
npm run seed
```

This creates:

- 5 categories (JavaScript, Python, React, Database, Node.js)
- 3 sample users (passwords: `password123`)
- 6 sample questions with various topics
- 5 sample answers

**Test Credentials:**

- Email: `john@example.com` / Password: `password123`
- Email: `jane@example.com` / Password: `password123`
- Email: `guru@example.com` / Password: `password123`

To clear the database:

```bash
npm run seed:destroy
```

## 🚀 Running the Application

### Option 1: Run Both Client and Server Concurrently (Recommended)

From the root directory:

```bash
npm run dev
```

This starts:

- Backend API on `http://localhost:5000`
- React frontend on `http://localhost:3000`

### Option 2: Run Separately

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm start
```

### Access the Application

Open your browser and navigate to:

- **Frontend:** `http://localhost:3000`
- **API:** `http://localhost:5000/api`

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | No            |
| POST   | `/api/auth/login`    | Login user        | No            |
| GET    | `/api/auth/me`       | Get current user  | Yes           |

### Categories

| Method | Endpoint              | Description         | Auth Required |
| ------ | --------------------- | ------------------- | ------------- |
| GET    | `/api/categories`     | Get all categories  | No            |
| GET    | `/api/categories/:id` | Get single category | No            |
| POST   | `/api/categories`     | Create category     | No\*          |
| PUT    | `/api/categories/:id` | Update category     | No\*          |
| DELETE | `/api/categories/:id` | Delete category     | No\*          |

\*Should be admin-only in production

### Questions

| Method | Endpoint                  | Description                      | Auth Required |
| ------ | ------------------------- | -------------------------------- | ------------- |
| GET    | `/api/questions`          | Get all questions (with filters) | No            |
| GET    | `/api/questions/:id`      | Get single question              | No            |
| POST   | `/api/questions`          | Create question                  | Yes           |
| PUT    | `/api/questions/:id`      | Update question                  | Yes (Owner)   |
| DELETE | `/api/questions/:id`      | Delete question                  | Yes (Owner)   |
| POST   | `/api/questions/:id/vote` | Vote on question                 | Yes           |

### Answers

| Method | Endpoint                             | Description                  | Auth Required        |
| ------ | ------------------------------------ | ---------------------------- | -------------------- |
| GET    | `/api/questions/:questionId/answers` | Get all answers for question | No                   |
| POST   | `/api/questions/:questionId/answers` | Create answer                | Yes                  |
| GET    | `/api/answers/:id`                   | Get single answer            | No                   |
| PUT    | `/api/answers/:id`                   | Update answer                | Yes (Owner)          |
| DELETE | `/api/answers/:id`                   | Delete answer                | Yes (Owner)          |
| POST   | `/api/answers/:id/vote`              | Vote on answer               | Yes                  |
| POST   | `/api/answers/:id/accept`            | Accept answer                | Yes (Question Owner) |

### Example API Requests

**Register:**

```json
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Question:**

```json
POST /api/questions
Headers: { "Authorization": "Bearer <token>" }
{
  "title": "How do I use React hooks?",
  "body": "I'm learning React and want to understand useState...",
  "category": "category_id_here",
  "tags": ["react", "hooks", "useState"]
}
```

**Vote:**

```json
POST /api/questions/:id/vote
Headers: { "Authorization": "Bearer <token>" }
{
  "vote": "up"  // or "down"
}
```

## 🧪 Testing the Application

1. **Start the application** using `npm run dev`
2. **Open** `http://localhost:3000`
3. **Register** a new account or login with test credentials
4. **Browse categories** and existing questions
5. **Ask a question** - create a new question in any category
6. **Answer questions** - provide helpful answers
7. **Vote** on questions and answers you find helpful
8. **Accept answers** on your own questions
9. **Earn reputation** through community participation

## 🌐 Application Pages

| Route            | Page            | Auth Required | Description                  |
| ---------------- | --------------- | ------------- | ---------------------------- |
| `/`              | Home            | No            | Landing page with categories |
| `/register`      | Register        | No            | New user registration        |
| `/login`         | Login           | No            | User login                   |
| `/questions`     | Questions List  | No            | Browse all questions         |
| `/questions/:id` | Question Detail | No            | View question and answers    |
| `/ask`           | Ask Question    | Yes           | Create new question          |
| `/users`         | Users (Legacy)  | No            | User management              |
| `/items`         | Items (Legacy)  | No            | Item management              |

## 🔧 Configuration

### Environment Variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/techhelphub
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
```

### Port Configuration

- **Backend:** Port 5000 (configurable in `server/.env`)
- **Frontend:** Port 3000 (default React port)
- Frontend proxies API requests to backend via `proxy` in `client/package.json`

## 📦 Dependencies

### Backend

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `colors` - Terminal colors for seeder

### Frontend

- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally or check Atlas connection
- Verify connection string in `.env` file
- Check firewall/network settings
- For Atlas: Ensure IP is whitelisted

### Authentication Issues

- Check JWT_SECRET is set in `.env`
- Clear browser localStorage if needed
- Verify token is being sent in request headers

### Port Already in Use

```bash
# Change port in server/.env
PORT=5001
```

### CORS Errors

- Ensure backend is running on port 5000
- Check proxy setting in `client/package.json`
- Verify CORS is enabled in server

### Module Not Found

```bash
# Reinstall dependencies
npm run install-all
```

## 🚀 Deployment

### Backend (Heroku/Railway/Render)

1. Set all environment variables
2. Update `MONGO_URI` to production MongoDB Atlas
3. Generate secure `JWT_SECRET`
4. Deploy backend code

### Frontend (Netlify/Vercel)

1. Update API base URL to production backend
2. Build: `npm run build` in client folder
3. Deploy `build` folder
4. Configure redirects for client-side routing

## 🎓 Learning Outcomes

This project demonstrates:

- ✅ 3-Tier architecture implementation
- ✅ RESTful API design with JSON
- ✅ User authentication with JWT
- ✅ Database modeling with relationships
- ✅ Single Page Application (SPA) development
- ✅ State management with Context API
- ✅ CRUD operations
- ✅ Vote and reputation systems
- ✅ Responsive web design

## 📝 License

ISC

## 👨‍💻 Author

Project 4 - Full-Stack Forum Application

---

**Start helping others and building your reputation today! 🚀**
