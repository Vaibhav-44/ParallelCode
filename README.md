# ParallelCode - Real-time Collaborative Code Editor

ParallelCode is a powerful, real-time collaborative code editor that allows multiple users to code together seamlessly. It features a live code editor, support for multiple programming languages, and an integrated terminal to see execution output. The application is built with a microservices architecture, consisting of a frontend, a backend, and a code execution service.

## Features

- **Real-time Collaboration:** Work with multiple users in the same coding room.
- **Live Code Editor:** See code changes from other users instantly.
- **Multi-language Support:** Write and execute code in various languages, including C++, Java, Python, JavaScript, and more.
- **Syntax Highlighting:** A rich code editor with multiple themes and language-specific syntax highlighting.
- **Integrated Terminal:** View the output of your code directly in the editor.
- **Room-based Sessions:** Create unique rooms for your coding sessions and share the ID to invite others.

## Architecture

The application is composed of three main services that run in separate Docker containers:

### 1. Frontend

- **Description:** A React-based single-page application that provides the user interface. It includes the code editor (CodeMirror), a list of connected clients, language/theme selection, and an output terminal.
- **Communication:** It communicates with the backend via a Socket.io connection for real-time updates and an HTTP API for code execution.
- **Technology:** React, Socket.io-client, Recoil, CodeMirror.

### 2. Backend

- **Description:** A Node.js server that manages user sessions, rooms, and real-time communication. It uses Socket.io to handle events like users joining/leaving rooms and to synchronize code changes among clients.
- **Communication:** It listens for socket connections from the frontend and forwards code execution requests to the executor service.
- **Technology:** Node.js, Express, Socket.io.

### 3. Executor

- **Description:** A specialized Node.js service responsible for executing code sent from the backend. It receives a language and a code string, then spins up a dedicated Docker container for that language to run the code securely.
- **Communication:** It exposes a single REST endpoint that the backend calls. It uses Dockerode to interact with the host's Docker daemon.
- **Technology:** Node.js, Express, Dockerode.

## Project Structure
```
/
├── backend/
│   ├── src/
│   │   ├── actions/
│   │   ├── routes/
│   │   ├── index.js
│   │   ├── rooms.js
│   │   ├── server.js
│   │   └── socket.js
│   ├── Dockerfile
│   └── package.json
├── executor/
│   ├── src/
│   │   ├── runners/
│   │   ├── execute.js
│   │   └── index.js
│   ├── docker/
│   │   ├── python.Dockerfile
│   │   └── ... (other language Dockerfiles)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── socket.js
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Service Responsibilities

-   **Frontend:** Owns the user interface, client-side state management, and user interactions. It is responsible for rendering the editor and broadcasting user events (like code changes) to the backend. It must never handle business logic or code execution.
-   **Backend:** Owns the real-time collaboration logic. It manages rooms, user sessions, and synchronizes state between clients. It is responsible for receiving events from one client and broadcasting them to others. It must never execute user code directly; instead, it delegates execution to the executor service.
-   **Executor:** Owns the code execution environment. It is responsible for receiving code, running it in a secure, isolated container, and returning the output. It must never handle user sessions or room management; its sole focus is on secure code execution.

## Real-Time Collaboration Model

The collaboration model is based on a centralized, server-authoritative approach using WebSockets (Socket.io).

1.  **Connection:** When a user enters a room, the frontend establishes a persistent WebSocket connection with the backend.
2.  **State Synchronization:** The backend maintains the authoritative state for each room, including the list of connected clients and the current code in the editor.
3.  **Event Broadcasting:** When a user types in the editor, the frontend emits a `CODE_CHANGE` event to the backend. The backend then broadcasts this event to all other clients in the same room.
4.  **Client-side Updates:** Upon receiving a `CODE_CHANGE` event, each client updates its local editor state to reflect the changes. This ensures that all users see the same code in near real-time.

## Code Execution Model

Code execution is designed to be secure and isolated, preventing arbitrary code from running on the host system.

1.  **Execution Request:** The user triggers an execution from the frontend, which sends an HTTP request to the backend containing the code and the selected language.
2.  **Delegation:** The backend validates the request and forwards it to the executor service via a REST API call.
3.  **Isolated Execution:** The executor service creates a temporary file containing the user's code. It then spins up a new, short-lived Docker container specific to the requested language (e.g., a Python container for Python code).
4.  **Output Capturing:** The code is executed within the container, and its `stdout` and `stderr` streams are captured. The container is destroyed immediately after execution.
5.  **Result Propagation:** The executor service returns the captured output to the backend, which then sends it back to the originating client via a WebSocket event. The frontend displays the output in the integrated terminal.

## Getting Started

You can run the entire application using Docker (recommended) or set up each service to run locally on your machine.

### Prerequisites

- **Docker:** Required for both the Docker and local installation methods. Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/).
- **Node.js:** Required for the local installation method. Download and install Node.js from [nodejs.org](https://nodejs.org/).
- **Git:** Required to clone the repository.

### Docker Installation (Recommended)

This is the simplest way to get the application running.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Vaibhav-44/ParallelCode.git
    cd ParallelCode
    ```

2.  **Start the services using Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```
    This command will build the images for the frontend, backend, and executor services and start them in detached mode.

3.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.

    To stop the application, run:
    ```bash
    docker-compose down
    ```

### Local Installation

This method requires you to run each service in a separate terminal.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/code-i-s.git
    cd code-i-s
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and another one in the `executor` directory with the following content:

    **`backend/.env`**
    ```
    PORT=5000
    EXECUTION_URL=http://localhost:4000
    EXECUTION_SECRET=change-me
    ```

    **`executor/.env`**
    ```
    PORT=4000
    EXECUTION_SECRET=change-me
    ```

3.  **Run the Executor service:**
    Open a terminal, navigate to the `executor` directory, and run:
    ```bash
    cd executor
    npm install
    npm run dev
    ```
    The executor service will be running on `http://localhost:4000`.

4.  **Run the Backend service:**
    Open a second terminal, navigate to the `backend` directory, and run:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The backend service will be running on `http://localhost:5000`.

5.  **Run the Frontend service:**
    Open a third terminal, navigate to the `frontend` directory, and run:
    ```bash
    cd frontend
    npm install
    npm start
    ```
    The frontend development server will start, and you can access the application at `http://localhost:3000` (or the port specified in the terminal). Make sure the React app is pointing to the correct backend URL. You may need to modify the `REACT_APP_BACKEND_URL` in `frontend/package.json` or related files to point to `http://localhost:5000`.
