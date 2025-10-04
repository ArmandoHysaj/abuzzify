# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your Abuzzify project.

## Prerequisites

1. A Firebase account
2. Node.js and npm installed
3. Your project dependencies installed (`npm install`)

## Firebase Project Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "abuzzify-auth")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and enable
   - **Google**: Click on it, enable, and configure with your domain

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 4. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Other existing variables...
NEXT_PUBLIC_GA_ID=your_ga_id_here
NEWS_API_KEY=your_news_api_key_here
```

Replace the placeholder values with your actual Firebase configuration values.

## Features Included

### Authentication Methods
- ✅ Email/Password registration and login
- ✅ Google OAuth authentication
- ✅ Password reset functionality
- ✅ Email verification

### User Management
- ✅ User profile display
- ✅ Account information
- ✅ Sign out functionality
- ✅ Email verification status

### Security Features
- ✅ Protected routes middleware
- ✅ Authentication state management
- ✅ Secure token handling
- ✅ Form validation with Zod

### UI Components
- ✅ Modern authentication modals
- ✅ User profile modal
- ✅ Navigation integration
- ✅ Responsive design
- ✅ Theme support (light/dark mode)

## Usage

### Authentication Flow

1. **Sign Up**: Users can create accounts with email/password or Google
2. **Sign In**: Existing users can log in with their credentials
3. **Profile**: Authenticated users can view and manage their profile
4. **Protected Routes**: Certain pages require authentication

### Protected Routes

To protect a route, wrap your component with `ProtectedRoute`:

```tsx
import ProtectedRoute from '@/app/components/Auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Using Authentication Context

```tsx
import { useAuth } from '@/app/contexts/AuthContext';

function MyComponent() {
  const { currentUser, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {currentUser ? (
        <div>Welcome, {currentUser.displayName}!</div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  );
}
```

## File Structure

```
src/app/
├── contexts/
│   └── AuthContext.tsx          # Authentication context and hooks
├── components/
│   └── Auth/
│       ├── AuthModal.tsx        # Login/signup modal
│       ├── UserProfile.tsx      # User profile modal
│       ├── ProtectedRoute.tsx   # Route protection component
│       ├── auth-modal.scss      # Auth modal styles
│       └── user-profile.scss    # User profile styles
├── lib/
│   └── firebase.ts              # Firebase configuration
└── middleware.ts                # Route protection middleware
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to your application
3. Click "Sign In" in the navigation
4. Test both email/password and Google authentication
5. Verify that protected routes require authentication

## Troubleshooting

### Common Issues

1. **Firebase configuration errors**: Ensure all environment variables are set correctly
2. **Google OAuth not working**: Check that your domain is added to authorized domains in Firebase
3. **Email verification not working**: Ensure your Firebase project has email verification enabled

### Development Mode

For local development, Firebase emulators can be used:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

The authentication system is configured to automatically connect to emulators in development mode.

## Security Notes

- Never expose Firebase configuration in client-side code (use environment variables)
- Always validate user input on both client and server
- Use HTTPS in production
- Regularly review and update your Firebase security rules
- Monitor authentication logs in Firebase Console

## Next Steps

1. Set up your Firebase project
2. Configure environment variables
3. Test the authentication flow
4. Customize the UI to match your brand
5. Add additional authentication providers if needed
6. Implement user roles and permissions
7. Set up Firestore for user data storage
