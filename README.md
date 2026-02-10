# Scalable Full-Stack Web Application

A modern, scalable full-stack web application built with React, Node.js/Express, MongoDB, and JWT authentication. Features a responsive dashboard with task management, user authentication, and profile management.

## 🚀 Features

### Frontend
- ✅ **React with Vite** - Fast development with Hot Module Replacement
- ✅ **TailwindCSS** - Responsive, mobile-first design
- ✅ **React Router** - Client-side routing with protected routes
- ✅ **Form Validation** - Client-side validation with real-time feedback
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Axios Interceptors** - Centralized API calls with error handling

### Backend
- ✅ **Node.js/Express** - RESTful API server
- ✅ **MongoDB/Mongoose** - NoSQL database with schema validation
- ✅ **JWT Authentication** - Secure token generation and validation
- ✅ **Bcrypt** - Password hashing for security
- ✅ **Express Validator** - Server-side validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **CORS** - Cross-Origin Resource Sharing enabled
- ✅ **File Upload** - Multer integration for document attachments (up to 5MB)

### Dashboard Features
- 📊 **User Profile Management** - View and edit profile information
- ✅ **Task Management** - Full CRUD operations on tasks
- 📎 **File Attachments** - Upload, download, and delete documents with tasks
- 🔍 **Search & Filter** - Search tasks by title/description, filter by status and priority
- 📅 **Sort Options** - Sort by date, priority, or due date
- 🎨 **Responsive UI** - Works seamlessly on desktop, tablet, and mobile

## 📁 Project Structure

```
scalable-web/
scalable-web/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── upload.js              # Multer file upload config
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── taskController.js      # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── error.js               # Error handling
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Task.js                # Task schema with attachments
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── taskRoutes.js          # Task endpoints
│   ├── utils/
│   │   └── jwt.js                 # JWT utilities
│   ├── uploads/                   # File upload directory (auto-created)
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx  # Route guard
    │   │   ├── TaskList.jsx        # Task display
    │   │   ├── TaskForm.jsx        # Task create/edit
    │   │   └── ProfileModal.jsx    # Profile editor
    │   ├── context/
    │   │   └── AuthContext.jsx     # Auth state management
    │   ├── pages/
    │   │   ├── Login.jsx           # Login page
    │   │   ├── Signup.jsx          # Registration page
    │   │   └── Dashboard.jsx       # Main dashboard
    │   ├── services/
    │   │   ├── api.js              # Axios instance
    │   │   ├── authService.js      # Auth API calls
    │   │   └── taskService.js      # Task API calls
    │   ├── App.jsx                 # App routing
    │   ├── main.jsx                # Entry point
    │   └── index.css               # Tailwind imports
    ├── .env                        # Environment variables
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd scalable-web
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
# Update MONGODB_URI with your MongoDB connection string
# Update JWT_SECRET with a secure random string (min 32 characters)

# Start MongoDB (if running locally)
mongod

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scalable-web
JWT_SECRET=your_secure_jwt_secret_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Tasks
- `GET /api/tasks` - Get all tasks (Protected, with filters)
  - Query params: `status`, `priority`, `search`, `sortBy`, `order`
- `GET /api/tasks/:id` - Get single task (Protected)
- `POST /api/tasks` - Create new task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Frontend and backend route protection
- **Input Validation**: Client and server-side validation
- **Error Handling**: Consistent error responses
- **CORS Configuration**: Controlled cross-origin access

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback for async operations
- **Modal Dialogs**: Task and profile editors
- **Color-coded Status**: Visual task status and priority indicators
- **Search & Filter**: Real-time task filtering
- **Sort Options**: Multiple sorting criteria

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables
2. Update CORS origin to production URL
3. Deploy using platform-specific instructions

### Frontend Deployment (e.g., Vercel, Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder

### Database
- Use MongoDB Atlas for production
- Update `MONGODB_URI` with Atlas connection string

## 🧪 Testing

### Backend
```bash
cd backend
# Add your test command here
```

### Frontend
```bash
cd frontend
npm run test
```

## 📝 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] File uploads for avatars
- [ ] Real-time notifications
- [ ] Task sharing and collaboration
- [ ] Task categories/tags
- [ ] Advanced analytics dashboard
- [ ] Export tasks to CSV/PDF
- [ ] Dark mode support
- [ ] Internationalization (i18n)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- MongoDB team for the flexible database
- Express.js community

---

**Built with ❤️ for scalability and best practices**
"# scalable-web" 
"# scalable-web" 
