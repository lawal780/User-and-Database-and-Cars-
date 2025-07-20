# Google OAuth Server-Side Implementation Guide

## 🚀 Server-Side Google OAuth Flow

Your authentication system now supports complete server-side Google OAuth with redirect flow.

## 📋 New Endpoints

### 1. **GET /api/auth/google**
- **Purpose**: Initiates Google OAuth flow
- **Response**: Returns Google authorization URL
- **Usage**: Client redirects user to this URL to start OAuth

### 2. **GET /api/auth/google/callback**
- **Purpose**: Handles Google OAuth callback
- **Parameters**: `code` (authorization code), `state` (optional)
- **Response**: User data and JWT token
- **Usage**: Google redirects here after user authorization

### 3. **DELETE /api/auth/unlink-google/:userId**
- **Purpose**: Unlinks Google account from user
- **Requirements**: User must have password set
- **Response**: Confirmation message

### 4. **POST /api/auth/set-password/:userId**
- **Purpose**: Sets password for Google-only users
- **Body**: `{ "password": "string", "confirmPassword": "string" }`
- **Response**: Confirmation message

## 🔧 Environment Variables Required

Add these to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Frontend URL (optional - for redirects)
FRONTEND_URL=http://localhost:3001
```

## 🎯 Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API and Google OAuth2 API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:4500/api/auth/google/callback`
   - For production: `https://yourdomain.com/api/auth/google/callback`

## 📱 Complete OAuth Flow

### Step 1: Client Initiates OAuth
```javascript
// Frontend code to start OAuth
const response = await fetch('/api/auth/google');
const { authUrl } = await response.json();
window.location.href = authUrl; // Redirect user to Google
```

### Step 2: User Authorizes on Google
- User sees Google consent screen
- User grants permissions
- Google redirects to your callback URL

### Step 3: Server Handles Callback
- Your server receives authorization code
- Exchanges code for access token
- Fetches user profile from Google
- Creates/updates user in database
- Returns JWT token

### Step 4: Client Receives Token
- Server can redirect to frontend with token
- Or return JSON response with token

## 🔄 Integration Options

### Option 1: Direct API Integration
```javascript
// Client makes request to initiate OAuth
const { authUrl } = await fetch('/api/auth/google').then(r => r.json());
window.location.href = authUrl;

// Server handles callback and returns JSON
// Client needs to handle the callback response
```

### Option 2: Frontend Redirect Integration
```javascript
// Simply redirect user to your OAuth endpoint
window.location.href = '/api/auth/google';

// Server handles everything and redirects back to frontend
```

## 🛡️ Security Features

- **Token Verification**: Verifies Google tokens server-side
- **Email Verification**: Ensures Google email is verified
- **Account Linking**: Links Google accounts to existing users
- **Secure Storage**: Stores minimal user data
- **JWT Generation**: Creates secure JWT tokens for your app

## 📊 User Flow Scenarios

### New User (First Time)
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. User authorizes permissions
4. New account created in your database
5. Welcome email sent
6. JWT token returned
7. User logged in to your app

### Existing User (Email Match)
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. User authorizes permissions
4. System finds existing account by email
5. Links Google account to existing user
6. Login notification email sent
7. JWT token returned
8. User logged in to your app

### Returning Google User
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. User authorizes permissions
4. System finds existing Google account
5. Login notification email sent
6. JWT token returned
7. User logged in to your app

## 🎨 Customization Options

### Custom Redirect Handling
Modify the callback function to redirect to your frontend:

```javascript
// In handleGoogleCallback function
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
return res.redirect(`${frontendUrl}/auth/success?token=${token}`);
```

### Custom Scopes
Modify the scopes in `initiateGoogleAuth`:

```javascript
scope: [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  // Add more scopes as needed
]
```

## 🔍 Testing Your Implementation

1. **Start your server**: `npm start`
2. **Test OAuth initiation**: 
   - GET `http://localhost:3000/api/auth/google`
   - Should return Google authorization URL
3. **Test full flow**:
   - Open the returned URL in browser
   - Complete Google OAuth
   - Check if callback works correctly

## 🎯 Production Considerations

1. **Update redirect URI** in Google Console for production domain
2. **Use HTTPS** in production
3. **Secure environment variables**
4. **Implement rate limiting** on OAuth endpoints
5. **Add proper error handling** for network failures
6. **Consider user experience** for mobile devices

Your server-side Google OAuth implementation is now complete and ready for production use!


