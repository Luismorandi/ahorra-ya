
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Get the actual publishable key from environment variables
// If you're running this locally, you need to add VITE_CLERK_PUBLISHABLE_KEY in your .env.local file
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in development and no key is provided, use a placeholder for UI development
// This prevents errors when no key is available during development
if (!PUBLISHABLE_KEY) {
  console.warn(
    "⚠️ No Clerk publishable key found. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file.\n" +
    "You can get your publishable key at https://dashboard.clerk.com/ in the API Keys section."
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY || "pk_placeholder_for_development_only"}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignInUrl="/"
      afterSignUpUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
