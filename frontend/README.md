# ParallelCode

A real-time collaborative code editor that allows multiple users to join private sessions and synchronize code changes instantly. Built with React, Node.js, and Socket.IO for seamless collaborative coding experiences.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **Private Sessions**: Create or join private rooms using unique room IDs
- **Multi-Language Support**: Supports 20+ programming languages including:
  - C/C++/C#/Java
  - Python, JavaScript, JSX
  - HTML, CSS, Sass
  - Go, Rust, Ruby, PHP
  - Dart, Swift, R
  - SQL, Shell, YAML, XML
  - And many more...
- **Multiple Themes**: Choose from 50+ CodeMirror themes for comfortable coding
- **User Management**: See connected users with avatars and real-time join/leave notifications
- **Responsive Design**: Works seamlessly across different devices and screen sizes
- **Copy Room ID**: Easily share room IDs with collaborators

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Recoil** - State management for React
- **CodeMirror 5** - Powerful code editor with syntax highlighting
- **React Hot Toast** - Beautiful toast notifications
- **React Avatar** - User avatar generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **PM2** - Process manager for production

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/code-i.git
   cd code-i
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run start:docker

   # Or run them separately:
   # Terminal 1: Start backend
   npm run server:dev

   # Terminal 2: Start frontend
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Configuration
SERVER_PORT=5000

# Frontend Configuration
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Docker Configuration

Update the `Dockerfile` and `docker-compose.yml` with your specific configuration:

- Set `REACT_APP_BACKEND_URL` to your backend URL
- Configure `SERVER_PORT` for the backend port
- Adjust port mappings in `docker-compose.yml` as needed

## 📖 Usage

### Creating a New Session

1. Visit the homepage
2. Click "Create new room" to generate a unique room ID
3. Enter your username
4. Click "Join" to enter the editor

### Joining an Existing Session

1. Visit the homepage
2. Paste the room ID provided by the session creator
3. Enter your username
4. Click "Join" to enter the collaborative editor

### In the Editor

- **Select Language**: Choose from the dropdown to change syntax highlighting
- **Select Theme**: Pick your preferred code editor theme
- **Copy Room ID**: Share the room ID with collaborators
- **Leave Room**: Exit the current session

## 🏗️ Project Structure

```
code-i/
├── public/                 # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── Client.js      # User client component
│   │   └── Editor.js      # Code editor component
│   ├── pages/              # Page components
│   │   ├── Home.js        # Landing page
│   │   └── EditorPage.js  # Main editor page
│   ├── actions/            # Socket action constants
│   ├── atoms.js            # Recoil state atoms
│   ├── socket.js           # Socket.IO client setup
│   ├── App.js              # Main App component
│   └── index.js            # App entry point
├── server.js               # Backend server
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## 🔌 API Reference

### Socket Events

#### Client → Server
- `join` - Join a room with roomId and username
- `code-change` - Broadcast code changes to room
- `sync-code` - Sync code with newly joined user

#### Server → Client
- `joined` - User joined the room
- `disconnected` - User left the room
- `code-change` - Code update from another user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CodeMirror](https://codemirror.net/) - The code editor component
- [Socket.IO](https://socket.io/) - Real-time communication
- [React](https://reactjs.org/) - UI framework
- [Express.js](https://expressjs.com/) - Backend framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy Coding! 🎉**
