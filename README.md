# 📄 Real-Time Collaborative Document System

A secure real-time collaborative document editor inspired by **Google Docs** and **Microsoft Word**, built using **React, Node.js, Socket.IO, MongoDB, and Redis**.

---

# 🚀 Tech Stack

- ⚛️ React
- 🟢 Node.js
- 🚂 Express.js
- 🔌 Socket.IO
- 🍃 MongoDB
- ⚡ Redis
- 🔐 JWT Authentication
- 🐳 Docker

---

# 📦 Prerequisites

Before starting the project, make sure you have installed:

- Node.js
- Docker
- Git

---

# 🟥 Redis Setup (Docker)

## Step 1: Create the Redis Stack Container

If you don't already have a Redis container, run:

```bash
docker run -d \
  --name redis-stack \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest
```

---

## Step 2: Verify the Container

```bash
docker ps
```

You should see the `redis-stack` container running.

---

## Step 3: Open Redis CLI

Enter the container:

```bash
docker exec -it redis-stack bash
```

Then launch Redis CLI:

```bash
redis-cli
```

---

## Step 4: Test Redis

Inside the Redis CLI:

```redis
PING
```

Expected output:

```text
PONG
```

This confirms Redis is running successfully.

---

## Redis Insight (Web UI)

Redis Stack includes a built-in web interface.

Open:

```
http://localhost:8001
```

You can inspect:

- Keys
- Values
- Memory usage
- Commands
- Real-time changes

---

# 🍃 MongoDB Setup (Docker)

## Create MongoDB Container

```bash
docker run -d \
  --name mongodb-lts \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6.0
```

---

## Start MongoDB

```bash
docker start mongodb-lts
```

---

# ▶️ Start Existing Containers

If you've already created the containers, simply start them:

### MongoDB

```bash
docker start mongodb-lts
```

### Redis

```bash
docker start redis-stack
```

---

# 🔌 Socket.IO Basics

| Method | Purpose |
|---------|---------|
| `socket.emit()` | Send an event |
| `socket.on()` | Receive an event |

Example:

```javascript
// Sender
socket.emit("message", data);

// Receiver
socket.on("message", (data) => {
    console.log(data);
});
```

---

# 🧪 Running Multiple Backend Servers

For testing multiple server instances:

```bash
export PORT=5000 && node backend/src/server.js
```

Example:

```bash
export PORT=5001 && node backend/src/server.js
```

---

# 🐳 Dockerizing the Backend

Once the backend is Dockerized, you won't need to start it manually. Simply build the image and run a container.

## Build the Docker Image

```bash
docker build -t <IMAGE_NAME> .
```

Example:

```bash
docker build -t rtcds-backend .
```

---

## Run the Docker Container

```bash
docker run -d \
  --name rtcds-backend \
  -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI="<YOUR_MONGODB_URI>" \
  -e REDIS_URI="<YOUR_REDIS_URI>" \
  -e JWT_SECRET="<YOUR_SECRET>" \
  rtcds-backend
```

Replace the environment variables with your own values.

---

# 📂 Useful Docker Commands

## Running Containers

```bash
docker ps
```

---

## All Containers

```bash
docker ps -a
```

---

## Stop a Container

```bash
docker stop <CONTAINER_NAME>
```

---

## Start a Container

```bash
docker start <CONTAINER_NAME>
```

---

## Remove a Container

```bash
docker rm <CONTAINER_NAME>
```

---

## Remove an Image

```bash
docker rmi <IMAGE_NAME>
```

---

# ✅ Project Workflow

1. Start MongoDB.
2. Start Redis.
3. Start the backend server (or Docker container).
4. Start the frontend.
5. Open the application in your browser.
6. Collaborate in real time.

---

# 🎯 Features

- 🔐 JWT Authentication
- 👥 Real-time Collaboration
- ⚡ Socket.IO Communication
- 📝 Live Document Editing
- 💾 Redis Caching
- 🍃 MongoDB Persistence
- 🐳 Docker Support
- 🚀 Multi-server Testing
- 📄 Google Docs–style Editing

---

# 👥 Contributors

This project is collaboratively developed and maintained by the project team.

Built with ❤️ using React, Node.js, Socket.IO, MongoDB, Redis, and Docker.