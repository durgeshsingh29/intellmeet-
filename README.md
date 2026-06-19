# IntellMeet - AI-Powered Enterprise Meeting & Collaboration Platform

IntellMeet is a full-stack MERN project based on the Zidio Web PDF brief. It includes secure authentication, meeting management, Socket.io real-time collaboration, WebRTC signaling hooks, AI-style meeting summaries, extracted action items, Kanban tasks, and analytics.

## Features

- JWT authentication with hashed passwords and protected routes
- Meeting creation, room codes, transcript capture, status updates, and meeting history
- Socket.io live chat, presence events, typing-ready structure, and WebRTC signaling events
- Browser camera preview and meeting-room controls
- AI meeting intelligence endpoint that summarizes transcripts and extracts action items without paid API keys
- Post-meeting task generation and Kanban-style tracking
- Analytics dashboard for meetings, tasks, saved follow-up time, and productivity score
- Seed script with demo users and sample meeting data

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Zustand, Axios, Socket.io Client |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB with Mongoose |
| Security | JWT, bcrypt, Helmet, CORS, auth rate limiting |
| AI | Mock summarizer by default, ready to replace with OpenAI or Hugging Face |

## Folder Structure

```text
intellmeet-mern/
  client/                 React frontend
  server/                 Express API + Socket.io
    src/
      controllers/
      middleware/
      models/
      routes/
      services/
      socket/
```

## Prerequisites

Install these on your system:

- Node.js 20 or newer
- MongoDB Community Server, MongoDB Atlas, or Docker MongoDB
- Git

## Setup

Open a terminal in this folder:

```bash
cd outputs/intellmeet-mern
npm run install:all
```

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/intellmeet
JWT_SECRET=use_a_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

For MongoDB Atlas, your URI should look like this after replacing the password:

```env
MONGO_URI=mongodb://durgeshsingh2905:YOUR_REAL_DB_PASSWORD@ac-3yialxf-shard-00-00.5dnh7kx.mongodb.net:27017,ac-3yialxf-shard-00-01.5dnh7kx.mongodb.net:27017,ac-3yialxf-shard-00-02.5dnh7kx.mongodb.net:27017/intellmeet?ssl=true&replicaSet=atlas-xbo49v-shard-0&authSource=admin&appName=Cluster0
```

Important: replace `YOUR_REAL_DB_PASSWORD` with your real Atlas database user password. If your password has special characters such as `@`, `#`, `/`, `?`, or `&`, URL-encode it first.

To enable real AI summaries, set:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Keep `AI_PROVIDER=mock` if you want the project to run without an AI API key.

## Seed Demo Data

Start MongoDB, then run:

```bash
npm run seed --prefix server
```

Demo login:

```text
Email: admin@intellmeet.com
Password: password123
```

## Run Locally

```bash
npm run dev
```

Open:

```text
Frontend: http://localhost:5173
Backend health: http://localhost:5000/api/health
```

## Main API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/meetings` | List meetings |
| POST | `/api/meetings` | Create meeting |
| GET | `/api/meetings/:id` | Meeting details + messages |
| POST | `/api/meetings/:id/transcript` | Add transcript line |
| POST | `/api/meetings/:id/intelligence` | Generate summary and action items |
| GET | `/api/tasks` | List tasks |
| PATCH | `/api/tasks/:id` | Update task status |
| GET | `/api/analytics` | Dashboard metrics |

## Socket.io Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `meeting:join` | client to server | Join meeting room |
| `meeting:leave` | client to server | Leave meeting room |
| `chat:send` | client to server | Send chat message |
| `chat:new` | server to clients | Broadcast new message |
| `presence:joined` | server to clients | Notify participants |
| `webrtc:offer` | both | WebRTC offer signaling |
| `webrtc:answer` | both | WebRTC answer signaling |
| `webrtc:ice` | both | ICE candidate signaling |

## How To Present This For Zidio Submission

1. Run the app locally and record login, meeting creation, chat, transcript, AI summary, task board, and analytics.
2. Deploy the backend to Render, Railway, Fly.io, or AWS.
3. Deploy the frontend to Vercel or Netlify.
4. Add your deployed API URL to `client/.env` as `VITE_API_URL`.
5. Add screenshots and demo credentials in your final documentation PDF.

## Production Improvements

- Replace mock AI in `server/src/services/aiService.js` with OpenAI Whisper/transcription plus summary generation.
- Add refresh tokens and token rotation.
- Add Redis adapter for Socket.io clustering.
- Add Cloudinary or S3 recording upload.
- Add unit/integration tests and GitHub Actions.
- Add TURN server support for reliable WebRTC across strict networks.
- Add Sentry, Prometheus, Grafana, and load testing reports.
# intellmeet-
