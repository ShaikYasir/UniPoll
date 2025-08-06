<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Live Polling System - Development Guidelines

## Project Overview

This is a real-time polling system built with React frontend and Express.js + Socket.io backend. The system supports two personas:

- **Teachers**: Can create polls, view results, manage students
- **Students**: Can join sessions, answer questions, view results

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, Socket.io-client, React Router
- **Backend**: Express.js, Socket.io, Node.js
- **Deployment**: Heroku-ready configuration

## Architecture Notes

- Real-time communication via Socket.io
- Redux for state management
- Session-based student identification (per browser tab)
- In-memory data storage (can be extended to database)

## Key Features

- Real-time polling with live updates
- Configurable time limits (30s - 5min)
- Student management (join/remove)
- Poll history tracking
- Responsive design matching Figma specifications

## Development Guidelines

1. Follow React functional components with hooks
2. Use Redux Toolkit for state management
3. Implement proper error handling for socket connections
4. Ensure responsive design for mobile compatibility
5. Follow accessibility best practices
6. Use semantic HTML and proper ARIA labels

## Deployment Considerations

- Environment variables for production
- Socket.io configured for cross-origin requests
- Static file serving for production builds
- Heroku Procfile and buildpacks configured

## File Structure

- `/client` - React frontend application
- `/server` - Express.js backend with Socket.io
- `/client/src/components` - Reusable React components
- `/client/src/pages` - Route-level components
- `/client/src/store` - Redux slices and store configuration
- `/client/src/services` - Socket.io service layer
