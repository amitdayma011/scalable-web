# Frontend Architecture Documentation

## Overview

This document describes the architecture and structure of the React frontend application built with Vite, TailwindCSS, and React Router.

---

## Technology Stack

- **React 19.2.0** - UI library
- **Vite 7.3.1** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **TailwindCSS v4** - Utility-first CSS framework
- **@tailwindcss/postcss** - PostCSS plugin for TailwindCSS

---

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # Reusable components
│   │   ├── ProfileModal.jsx  # User profile editor
│   │   ├── ProtectedRoute.jsx # Authentication guard
│   │   ├── TaskForm.jsx      # Task create/edit form
│   │   └── TaskList.jsx      # Task display grid
│   ├── context/              # React Context providers
│   │   └── AuthContext.jsx   # Authentication state
│   ├── pages/                # Page components
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Login.jsx         # Login page
│   │   └── Signup.jsx        # Registration page
│   ├── services/             # API service layer
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── authService.js   # Authentication API calls
│   │   └── taskService.js   # Task API calls
│   ├── App.jsx               # Root component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles and Tailwind imports
├── .env                      # Environment variables
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # TailwindCSS configuration
└── vite.config.js            # Vite configuration
```

---

## Core Components

### 1. App.jsx (Root Component)

**Purpose:** Defines application routing and wraps app with providers.

**Routes:**
- `/` → Redirects to `/dashboard`
- `/login` → Login page
- `/signup` → Signup page
- `/dashboard` → Protected dashboard (requires authentication)

**Code Structure:**
```jsx
<Router>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  </AuthProvider>
</Router>
```

---

### 2. AuthContext (State Management)

**File:** `src/context/AuthContext.jsx`

**Purpose:** Manages global authentication state using React Context API.

**State:**
- `user` - Current user object (null if not authenticated)
- `loading` - Loading state for async operations
- `isAuthenticated` - Boolean flag for auth status

**Methods:**
- `signup(userData)` - Register new user
- `login(credentials)` - Authenticate user
- `logout()` - Clear authentication
- `updateUser(userData)` - Update user state

**Usage:**
```jsx
import { useAuth } from '../context/AuthContext';

function Component() {
  const { user, login, logout, isAuthenticated } = useAuth();
  // Use auth state and methods
}
```

---

### 3. API Service Layer

#### api.js (Axios Instance)

**Purpose:** Centralized HTTP client with interceptors.

**Features:**
- Request interceptor: Automatically adds JWT token to headers
- Response interceptor: Handles 401 errors (token expiration)
- Base URL configuration from environment variables

**Code:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - add token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### authService.js

**Methods:**
- `signup(userData)` - POST /api/auth/signup
- `login(credentials)` - POST /api/auth/login
- `logout()` - Clear localStorage
- `getProfile()` - GET /api/auth/me
- `updateProfile(userData)` - PUT /api/auth/profile
- `getCurrentUser()` - Get user from localStorage
- `isAuthenticated()` - Check auth status

#### taskService.js

**Methods:**
- `getTasks(filters)` - GET /api/tasks with query params
- `getTask(id)` - GET /api/tasks/:id
- `createTask(taskData)` - POST /api/tasks
- `updateTask(id, taskData)` - PUT /api/tasks/:id
- `deleteTask(id)` - DELETE /api/tasks/:id

---

## Page Components

### 1. Login Page

**File:** `src/pages/Login.jsx`

**Features:**
- Email and password inputs
- Client-side validation
- Real-time error display
- Loading states
- Link to signup page

**Validation:**
- Email: Required, valid format
- Password: Required

**Flow:**
1. User enters credentials
2. Client validates input
3. Calls `authService.login()`
4. On success: Updates context, redirects to dashboard
5. On error: Displays error message

---

### 2. Signup Page

**File:** `src/pages/Signup.jsx`

**Features:**
- Name, email, password, confirm password inputs
- Comprehensive validation
- Password matching check
- Loading states
- Link to login page

**Validation:**
- Name: Required, non-empty
- Email: Required, valid format
- Password: Required, min 6 characters
- Confirm Password: Must match password

---

### 3. Dashboard Page

**File:** `src/pages/Dashboard.jsx`

**Features:**
- User profile card with edit button
- Task statistics (total, pending, in-progress, completed)
- Search bar
- Filter by status and priority
- Sort by multiple fields (date, priority, status)
- Ascending/descending order toggle
- Create new task button
- Task list with edit/delete actions

**State Management:**
```javascript
const [tasks, setTasks] = useState([]);
const [filteredTasks, setFilteredTasks] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [priorityFilter, setPriorityFilter] = useState('');
const [sortBy, setSortBy] = useState('createdAt');
const [sortOrder, setSortOrder] = useState('desc');
```

**Filter Logic:**
1. Search: Filters by title/description (case-insensitive)
2. Status filter: Shows only matching status
3. Priority filter: Shows only matching priority
4. Sort: Applies sorting by selected field and order

---

## Reusable Components

### 1. ProtectedRoute

**File:** `src/components/ProtectedRoute.jsx`

**Purpose:** Guards routes that require authentication.

**Logic:**
- If loading: Show spinner
- If authenticated: Render children
- If not authenticated: Redirect to login

**Usage:**
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

### 2. TaskList

**File:** `src/components/TaskList.jsx`

**Props:**
- `tasks` - Array of task objects
- `onEdit(task)` - Callback for edit action
- `onDelete(taskId)` - Callback for delete action

**Features:**
- Grid layout (responsive: 1 col → 2 cols → 3 cols)
- Color-coded status badges
- Color-coded priority badges
- Edit and delete buttons with icons
- Displays due date if set
- Empty state message

**Status Colors:**
- Pending: Yellow
- In Progress: Blue
- Completed: Green

**Priority Colors:**
- Low: Gray
- Medium: Orange
- High: Red

---

### 3. TaskForm (Modal)

**File:** `src/components/TaskForm.jsx`

**Props:**
- `task` - Task object for editing (null for create)
- `onSubmit(formData)` - Callback with form data
- `onClose()` - Callback to close modal

**Features:**
- Modal overlay
- Title input (required)
- Description textarea
- Status dropdown
- Priority dropdown
- Due date picker
- Client-side validation
- Loading states
- Cancel and submit buttons

**Validation:**
- Title: Required, non-empty

---

### 4. ProfileModal

**File:** `src/components/ProfileModal.jsx`

**Props:**
- `onClose()` - Callback to close modal

**Features:**
- Edit name, email, bio
- Optional password change
- Password confirmation
- Client-side validation
- Success/error messages
- Loading states

**Validation:**
- Name: Required
- Email: Required, valid format
- Password: Optional, min 6 characters
- Confirm Password: Must match password

---

## Styling Architecture

### TailwindCSS Configuration

**File:** `tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Global Styles

**File:** `src/index.css`

```css
@import "tailwindcss";

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Common Patterns:**
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grid
- `px-4 sm:px-6 lg:px-8` - Responsive padding
- `text-sm sm:text-base lg:text-lg` - Responsive text

---

## State Management Strategy

### Local State
Used for component-specific state (form inputs, loading, errors).

**Example:**
```jsx
const [formData, setFormData] = useState({ title: '', description: '' });
const [loading, setLoading] = useState(false);
```

### Context API
Used for global state (authentication, user data).

**Why Context?**
- Simple authentication state
- No need for complex state management
- Prevents prop drilling
- Easy to implement

---

## Data Flow

### Authentication Flow

1. **Login/Signup:**
   ```
   Page → authService → API → localStorage + Context Update → Dashboard
   ```

2. **Protected Route Access:**
   ```
   Route → ProtectedRoute → Check Context → Render/Redirect
   ```

3. **API Calls:**
   ```
   Component → Service → Axios Interceptor (add token) → API
   ```

4. **Token Expiration:**
   ```
   API (401) → Axios Interceptor → Clear Storage → Redirect to Login
   ```

### Task Management Flow

1. **Fetch Tasks:**
   ```
   Dashboard → taskService.getTasks() → Update State → Render TaskList
   ```

2. **Create Task:**
   ```
   TaskForm → onSubmit → taskService.createTask() → Refetch → Update UI
   ```

3. **Update Task:**
   ```
   TaskList → onEdit → Open TaskForm → onSubmit → taskService.updateTask()
   ```

4. **Delete Task:**
   ```
   TaskList → onDelete → Confirm → taskService.deleteTask() → Update State
   ```

---

## Error Handling

### API Errors

**Service Layer:**
```javascript
try {
  const response = await api.post('/endpoint', data);
  return response.data;
} catch (error) {
  // Error is thrown to component
  throw error;
}
```

**Component:**
```javascript
try {
  await taskService.createTask(data);
  // Success
} catch (error) {
  setApiError(error.response?.data?.message || 'An error occurred');
}
```

### Form Validation Errors

**Client-side:**
```javascript
const validateForm = () => {
  const errors = {};
  if (!formData.email) errors.email = 'Email is required';
  if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
  return errors;
};
```

**Display:**
```jsx
{errors.email && (
  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
)}
```

---

## Performance Optimizations

### 1. Code Splitting
Vite automatically code-splits by route.

### 2. Lazy Loading
Can be added for components:
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### 3. Memoization
Can be added for expensive computations:
```javascript
const filteredTasks = useMemo(() => {
  return tasks.filter(/* ... */);
}, [tasks, filters]);
```

### 4. Debouncing
Can be added for search:
```javascript
const debouncedSearch = useDebounce(searchQuery, 300);
```

---

## Security Considerations

### 1. Token Storage
- JWT stored in localStorage
- Automatically included in API requests
- Cleared on logout or 401 response

### 2. Protected Routes
- All sensitive routes wrapped in ProtectedRoute
- Redirects to login if not authenticated

### 3. Input Sanitization
- All user input validated client-side
- Server validates again (defense in depth)

### 4. XSS Prevention
- React escapes output by default
- Never use dangerouslySetInnerHTML without sanitization

---

## Environment Variables

**File:** `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

**Usage:**
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

**Note:** Vite requires `VITE_` prefix for exposed variables.

---

## Build and Deployment

### Development
```bash
npm run dev
```
Starts Vite dev server on `http://localhost:5173`

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Preview production build locally

### Deployment
1. Build the app: `npm run build`
2. Deploy `dist/` folder to:
   - **Vercel:** `vercel deploy`
   - **Netlify:** `netlify deploy`
   - **Static hosting:** Upload `dist/` contents

**Important:** Set `VITE_API_URL` to production backend URL.

---

## Testing Strategy

### Unit Tests
Test individual components and utilities.

**Example:**
```javascript
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

test('renders empty state', () => {
  render(<TaskList tasks={[]} />);
  expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
});
```

### Integration Tests
Test user flows and API interactions.

**Example:**
```javascript
test('user can create a task', async () => {
  // Mock API
  // Render Dashboard
  // Fill form
  // Submit
  // Verify task appears
});
```

---

## Future Enhancements

1. **Real-time Updates** - WebSocket for live task updates
2. **Offline Support** - Service workers and IndexedDB
3. **Dark Mode** - Theme toggle with TailwindCSS
4. **Internationalization** - Multi-language support
5. **Advanced Filtering** - Date ranges, tags, categories
6. **Drag and Drop** - Reorder tasks
7. **Task Sharing** - Collaborate with other users
8. **Notifications** - Browser notifications for due dates
9. **Analytics** - Task completion statistics
10. **Export/Import** - CSV, JSON export

---

## Troubleshooting

### Common Issues

**1. API calls fail with 404**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Verify endpoint URLs

**2. Styles not applying**
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server
- Check TailwindCSS classes

**3. Authentication not persisting**
- Check localStorage in DevTools
- Verify token is being saved
- Check token expiration

**4. Hot reload not working**
- Restart dev server
- Check file watchers limit (Linux/Mac)

---

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Extract reusable logic to custom hooks
   - Use composition over inheritance

2. **State Management**
   - Lift state only when needed
   - Use Context sparingly
   - Keep related state together

3. **API Calls**
   - Always handle loading states
   - Display meaningful error messages
   - Use try-catch consistently

4. **Styling**
   - Use TailwindCSS utilities
   - Maintain consistent spacing
   - Follow mobile-first approach

5. **Code Quality**
   - Use ESLint for code quality
   - Add PropTypes or TypeScript
   - Write meaningful commit messages

---

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
