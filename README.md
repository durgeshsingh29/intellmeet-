# IntellMeet - AI-Powered Enterprise Meeting & Collaboration Platform

IntellMeet is a production-style full-stack MERN application for enterprise meetings, real-time collaboration, AI meeting intelligence, task tracking, and analytics.

It includes secure authentication, meeting room management, Socket.io chat, WebRTC signaling hooks, transcript capture, AI-style meeting summaries, action item extraction, Kanban task tracking, and productivity insights.

---

## Features

* User registration and login with JWT authentication
* Password hashing with bcrypt
* Protected backend API routes
* Meeting creation and meeting history
* Unique meeting room codes
* Real-time chat using Socket.io
* Presence events for meeting participants
* WebRTC signaling events for video call integration
* Browser camera preview in meeting room
* Transcript capture for meetings
* AI meeting summary generation
* Action item extraction from meeting transcript
* Automatic task creation from action items
* Kanban-style task board
* Analytics dashboard for meetings, tasks, saved time, and productivity score
* MongoDB Atlas or local MongoDB support
* Docker support for MongoDB/server setup
* Clean MERN folder structure

---

## Tech Stack

| Layer                   | Technology                           |
| ----------------------- | ------------------------------------ |
| Frontend                | React, Vite, React Router            |
| Styling                 | CSS                                  |
| Icons                   | Lucide React                         |
| State Management        | React Context, Zustand               |
| API Client              | Axios                                |
| Backend                 | Node.js, Express.js                  |
| Database                | MongoDB, Mongoose                    |
| Real-Time Communication | Socket.io                            |
| Authentication          | JWT, bcrypt                          |
| Security                | Helmet, CORS, Rate Limiting          |
| AI Integration          | Mock AI (Default), OpenAI Compatible |

---

## Project Structure

```text
intellmeet-mern/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── app.js
│   │   ├── index.js
│   │   └── seed.js
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Prerequisites

Install the following before running the project:

* Node.js 20+
* npm
* MongoDB Atlas account or Local MongoDB
* Git

---

## Environment Setup

### Server Environment

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/intellmeet
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Client Environment

Create a `.env` file inside the `client` folder.

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## MongoDB Atlas Setup

Replace `MONGO_URI` in `server/.env` with your Atlas connection string.

Example:

```env
MONGO_URI=mongodb://username:password@cluster-url/intellmeet?ssl=true&authSource=admin
```

### Important Notes

* Never commit `.env` files to GitHub.
* Keep database credentials private.
* URL-encode special characters in passwords.
* Allow your current IP address in MongoDB Atlas Network Access.

---

## Installation

### Install All Dependencies

```bash
npm run install:all
```

### Or Install Manually

```bash
npm install
npm install --prefix server
npm install --prefix client
```

---

## Seed Demo Data

```bash
npm run seed --prefix server
```

### Demo Credentials

```text
Email: admin@intellmeet.com
Password: password123
```

---

## Run Locally

### Start Frontend and Backend

```bash
npm run dev
```

### Open Frontend

```text
http://localhost:5173
```

### Backend Health Check

```text
http://localhost:5000/api/health
```

Expected Response:

```json
{
  "ok": true,
  "service": "IntellMeet API"
}
```

---

## API Routes

### Authentication

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register User    |
| POST   | /api/auth/login    | Login User       |
| GET    | /api/auth/me       | Get Current User |

### Meetings

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| GET    | /api/meetings                  | Get User Meetings     |
| POST   | /api/meetings                  | Create Meeting        |
| GET    | /api/meetings/:id              | Get Meeting Details   |
| PATCH  | /api/meetings/:id/status       | Update Meeting Status |
| POST   | /api/meetings/:id/transcript   | Add Transcript Line   |
| POST   | /api/meetings/:id/intelligence | Generate AI Summary   |

### Tasks

| Method | Endpoint       | Description |
| ------ | -------------- | ----------- |
| GET    | /api/tasks     | Get Tasks   |
| POST   | /api/tasks     | Create Task |
| PATCH  | /api/tasks/:id | Update Task |

### Analytics

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| GET    | /api/analytics | Get Productivity Analytics |

---

## Socket.io Events

| Event           | Direction       | Description             |
| --------------- | --------------- | ----------------------- |
| meeting:join    | Client → Server | Join Meeting Room       |
| meeting:leave   | Client → Server | Leave Meeting Room      |
| chat:send       | Client → Server | Send Chat Message       |
| chat:new        | Server → Client | Receive Chat Message    |
| presence:joined | Server → Client | Participant Joined      |
| presence:left   | Server → Client | Participant Left        |
| webrtc:offer    | Client ↔ Server | WebRTC Offer Signaling  |
| webrtc:answer   | Client ↔ Server | WebRTC Answer Signaling |
| webrtc:ice      | Client ↔ Server | ICE Candidate Signaling |

---

## AI Meeting Intelligence

The application works without any paid AI service.

### Mock AI Mode (Default)

```env
AI_PROVIDER=mock
```

### Real AI Mode

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### AI Capabilities

* Meeting Summary Generation
* Action Item Extraction
* Follow-up Recommendations
* Automatic Task Creation

AI service location:

```text
server/src/services/aiService.js
```

---

## Security Features

* JWT Authentication
* bcrypt Password Hashing
* Protected API Routes
* Helmet Security Headers
* CORS Configuration
* Rate Limiting
* Environment Variables for Secrets
* .env Ignored by Git

---

## Docker Support

### Start MongoDB

```bash
docker compose up -d mongo
```

### Run Backend

```bash
npm run dev --prefix server
```

---

## Common Issues

### Port 5000 Already in Use

Check process:

```powershell
Get-NetTCPConnection -LocalPort 5000
```

Stop process:

```powershell
Stop-Process -Id YOUR_PROCESS_ID -Force
```

### Frontend Starts on 5174 or 5175

Update:

```env
CLIENT_URL=http://localhost:5174
```

inside `server/.env`.

### Invalid Credentials

Run:

```bash
npm run seed --prefix server
```

Login using:

```text
admin@intellmeet.com
password123
```

### Cannot Reach Backend

Verify:

```text
http://localhost:5000/api/health
```

Ensure:

* Backend server is running
* MongoDB connection is valid
* Port 5000 is available
* No firewall restrictions

---

## Deployment Guide

### Frontend Deployment

Supported Platforms:

* Vercel
* Netlify
* Render Static Site

Environment Variables:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

### Backend Deployment

Supported Platforms:

* Render
* Railway
* Fly.io
* AWS
* DigitalOcean

Environment Variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-url.com
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

---

## Future Improvements

* Full WebRTC Peer-to-Peer Video Calls
* Screen Sharing
* Meeting Recording Uploads
* Cloudinary / AWS S3 Storage
* Refresh Token Rotation
* Redis Socket.io Adapter
* Team Workspaces
* Role-Based Access Control
* Email Invitations
* Push Notifications
* Unit Testing
* Integration Testing
* CI/CD with GitHub Actions
* Monitoring with Sentry, Prometheus & Grafana

---

## Demo Account

```text
Email: admin@intellmeet.com
Password: password123
```

---

## Author

Durgesh Singh

Developed as a MERN Full-Stack Project for Zidio Development Web Development Domain.

---

## License

This project is intended for educational, internship, and portfolio purposes.
