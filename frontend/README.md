# Task Management System

A modern, responsive task management application built with React 18, TypeScript, and Tailwind CSS. Features drag-and-drop task management, user authentication, role-based access control, and real-time updates.

## 🚀 Features

### Core Functionality
- **User Authentication**: Login and registration with JWT tokens
- **Task Management**: Create, edit, delete, and organize tasks
- **Drag & Drop**: Intuitive drag-and-drop interface for task status updates
- **Role-Based Access**: Admin and User roles with different permissions
- **Real-time Updates**: Optimistic updates with error handling
- **Responsive Design**: Mobile-first design that works on all devices

### Task Management Features
- **Task Statuses**: Pending, In Progress, Completed
- **Task Priorities**: Low, Medium, High with color coding
- **Assignee Management**: Assign tasks to team members
- **Inline Editing**: Edit task title, description, and priority directly
- **Task Filtering**: Filter by status, assignee, and search terms
- **Task Search**: Full-text search across task titles and descriptions

### User Experience
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Loading States**: Proper loading indicators and error handling
- **Toast Notifications**: Success and error feedback
- **Keyboard Shortcuts**: Enter to save, Escape to cancel inline edits
- **Auto-logout**: Automatic logout on token expiration

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2.0**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with full type checking
- **Vite**: Fast build tool and development server

### UI & Styling
- **Tailwind CSS 3.3.6**: Utility-first CSS framework
- **Lucide React 0.294.0**: Beautiful, customizable icons
- **React Hot Toast 2.4.1**: Elegant toast notifications

### State Management & Forms
- **React Hook Form 7.48.2**: Performant forms with easy validation
- **Zod 3.22.4**: TypeScript-first schema validation
- **Custom Hooks**: Simple state management with useAuth, useTasks, useUsers

### Drag & Drop
- **@dnd-kit/core 6.1.0**: Modern drag-and-drop toolkit
- **@dnd-kit/sortable 8.0.0**: Sortable functionality
- **@dnd-kit/utilities 3.2.2**: Utility functions for drag-and-drop

### HTTP & API
- **Axios 1.6.2**: HTTP client with interceptors
- **React Router DOM 6.20.1**: Client-side routing with protected routes

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on `https://localhost:7004`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The project uses environment variables for configuration. A `.env.development` file is already configured:

```env
# Development Environment Configuration
VITE_API_BASE_URL=https://localhost:7004/api
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   │   ├── AuthRedirect.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/       # Dashboard components
│   │   └── Dashboard.tsx
│   ├── layout/          # Layout components
│   │   └── Header.tsx
│   └── tasks/           # Task-related components
│       ├── DraggableTaskCard.tsx
│       ├── DraggableTaskColumn.tsx
│       ├── TaskCard.tsx
│       ├── TaskColumn.tsx
│       └── TaskForm.tsx
├── constants/           # Application constants
│   └── api.ts          # API endpoints and configuration
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useTasks.ts     # Task management hook
│   └── useUsers.ts     # User management hook
├── services/           # API services
│   ├── api.ts          # Axios configuration
│   ├── apiService.ts   # Combined API service
│   ├── authService.ts  # Authentication service
│   ├── taskService.ts  # Task API service
│   └── userService.ts  # User API service
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── utils/              # Utility functions
│   └── validation.ts   # Zod validation schemas
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://localhost:7004/api` |

### API Endpoints

The application uses the following API endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### Tasks
- `GET /tasks` - Get all tasks (with optional filters)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

## 👥 User Roles & Permissions

### Admin Role
- Create, edit, and delete any task
- Assign tasks to any user
- View all users and tasks
- Access to all filtering options

### User Role
- Create, edit, and delete own tasks
- Can only assign tasks to themselves
- View only own tasks (unless assigned by admin)
- Limited filtering options

## 🎨 UI Components

### Task Cards
- **Inline Editing**: Click on title, description, or priority to edit
- **Drag & Drop**: Drag tasks between status columns
- **Priority Colors**: Visual priority indicators (Low: Green, Medium: Yellow, High: Red)
- **Assignee Display**: Shows assigned user or "Unassigned"

### Dashboard Features
- **Task Statistics**: Shows count of tasks by status
- **Search & Filter**: Search tasks and filter by assignee/status
- **User Info Card**: Displays current user information
- **Responsive Layout**: Adapts to different screen sizes

## 🔐 Authentication Flow

1. **Login/Register**: Users authenticate with email and password
2. **JWT Token**: Server returns JWT token and user data
3. **Token Storage**: Token stored in localStorage with expiration checking
4. **Auto-logout**: Automatic logout when token expires
5. **Protected Routes**: Routes protected by authentication status

## 🚀 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Issues
- Ensure backend API is running on `https://localhost:7004`
- Check CORS configuration on backend
- Verify SSL certificate for HTTPS

#### 2. Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

#### 3. Environment Variables
- Ensure `.env.development` file exists in project root
- Verify `VITE_` prefix for environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool
- [dnd-kit](https://dndkit.com/) - Drag and drop library
- [Lucide](https://lucide.dev/) - Icon library