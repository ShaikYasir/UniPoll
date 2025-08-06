# Live Polling System

A real-time polling system designed for educational environments with Teacher and Student personas. Built with React and Express.js with Socket.io for real-time communication.

## 🚀 Features

### Teacher Features

- Create new polls with multiple choice options
- Configure time limits (30 seconds to 5 minutes)
- View live polling results with real-time updates
- Manage students (view list, remove students)
- View poll history
- Automatic poll progression control

### Student Features

- Join sessions with unique names
- Answer questions within time limits
- View live results after submission
- Real-time connection status
- Mobile-responsive interface

### System Features

- Real-time synchronization via Socket.io
- 60-second default time limit with countdown timer
- Automatic session management
- Cross-platform compatibility
- Production-ready deployment configuration

## 🛠️ Technology Stack

- **Frontend**: React 18, Redux Toolkit, Socket.io-client, React Router
- **Backend**: Express.js, Socket.io, Node.js
- **Styling**: Custom CSS with responsive design
- **Deployment**: Heroku-ready with Procfile and environment configuration

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd live-polling-system
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

### Manual Setup

If you prefer to start servers individually:

1. **Start the backend server**

   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend (in another terminal)**
   ```bash
   cd client
   npm install
   npm start
   ```

## 🌐 Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment with the following setup:

1. **Fork or clone the repository**

   ```bash
   git clone <repository-url>
   cd live-polling-system
   ```

2. **Install Vercel CLI** (if not already installed)

   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel**

   ```bash
   vercel
   ```

   Follow the prompts:

   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - What's your project's name? **live-polling-system**
   - In which directory is your code located? **.**

4. **Set environment variables** (optional)

   ```bash
   vercel env add NODE_ENV
   # Enter: production
   ```

5. **Alternative: Deploy via GitHub**
   - Push your code to GitHub
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

### Manual Configuration

If you need to customize the deployment:

1. **Environment Variables**:

   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-vercel-app.vercel.app`

2. **Build Settings**:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

### Other Deployment Options

#### Heroku Deployment

1. **Create a new Heroku app**

   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

## 🎯 Usage

1. **Access the application** at your deployed URL or http://localhost:3000
2. **Choose your role**: Teacher or Student
3. **Teachers**: Create polls and manage the session
4. **Students**: Enter your name and participate in real-time polls

## 📁 Project Structure

```
live-polling-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── services/       # Socket.io service
│   │   ├── store/          # Redux store & slices
│   │   └── App.js
│   └── package.json
├── server/                 # Express.js backend
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── package.json
├── .github/
│   └── copilot-instructions.md
├── Procfile              # Heroku deployment
├── package.json          # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

For production:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-production-domain.com
```

## 🎨 Design

The UI follows the provided Figma design specifications with:

- Clean, modern interface
- Responsive design for mobile and desktop
- Real-time visual feedback
- Accessibility considerations
- Professional color scheme

## 🚀 Performance Features

- Automatic connection management
- Optimized bundle sizes
- Real-time updates without page refreshes
- Efficient state management with Redux
- Mobile-optimized interface

## 🔒 Security Features

- CORS configuration for production
- Input validation and sanitization
- Session-based student management
- Error handling for network issues

## 📈 Scalability

The current implementation uses in-memory storage for simplicity. For production scale:

- Add database integration (MongoDB, PostgreSQL)
- Implement Redis for session management
- Add horizontal scaling with Redis adapter
- Consider microservices architecture for large deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section below
2. Create an issue in the repository
3. Review the documentation

## 🔧 Troubleshooting

### Common Issues

**Connection Issues**

- Ensure both frontend and backend are running
- Check CORS configuration for production
- Verify environment variables are set correctly

**Build Issues**

- Ensure Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall dependencies

**Deployment Issues**

- Check Heroku logs: `heroku logs --tail`
- Verify environment variables in production
- Ensure build scripts are configured correctly

---

Built with ❤️ for educational environments
