# Scan Notes Manager

A full-stack application for managing scan notes in a medical imaging context. Built with React TypeScript frontend using modern state management (TanStack Query + Zustand) and ASP.NET Core backend with comprehensive validation, orchestrated with Docker.

## 📋 Project Overview

This is a production-ready implementation of a Scan Notes Manager, designed to allow clinicians to:
- View a list of patient scans with detailed metadata
- View all notes associated with a specific scan
- Add new notes to scans with comprehensive validation
- Experience modern, professional UI with optimistic updates

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Nginx         │    │   Backend       │
│   React 19 TS   │◄──►│   Reverse       │◄──►│   ASP.NET Core  │
│   TanStack+Zustand│    │   Proxy         │    │   Validation    │
│   Port: 5173    │    │   Port: 80      │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **React 19.1.0** with TypeScript Strict Mode
- **TanStack Query 5.83.0** for server state management
- **Zustand 5.0.6** for client state management
- **Vite 7.0.4** for lightning-fast development
- **Tailwind CSS 4.1.11** with custom design system
- **Axios** for type-safe HTTP client

### Backend
- **ASP.NET Core 8.0** with Minimal APIs
- **Model validation** with DataAnnotations
- **Global error handling** middleware
- **In-memory storage** with singleton service
- **CORS configuration** for development
- **Structured logging** and proper HTTP status codes

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **Nginx** as reverse proxy with optimized routing
- **Hot reload** for both frontend and backend
- **Development** and **production** configurations

## 📁 Project Structure

```
ScanNotesManager/
├── modules/
│   ├── frontend/                    # React TypeScript application
│   │   ├── src/
│   │   │   ├── components/          # UI components
│   │   │   │   ├── layout/          # App shell layout
│   │   │   │   ├── shell/           # Header, Sidebar, MainContent
│   │   │   │   └── error/           # Error boundary
│   │   │   ├── hooks/               # Custom hooks
│   │   │   │   └── queries/         # TanStack Query hooks
│   │   │   ├── stores/              # Zustand stores
│   │   │   ├── services/            # API services
│   │   │   ├── types/               # TypeScript types
│   │   │   └── lib/                 # Query client configuration
│   │   └── ...
│   └── backend/                     # ASP.NET Core Web API
│       ├── DTOs/                    # Data Transfer Objects
│       ├── Models/                  # Domain models
│       ├── Services/                # Business logic
│       └── Program.cs               # API configuration
├── docker/                          # Docker configurations
├── docker-compose.yml               # Multi-container setup
└── README.md                        # This file
```

## ⚡ Quick Start

### Prerequisites
- **Docker** & **Docker Compose** (required)
- **Node.js 18+** (for local development)
- **.NET 8.0 SDK** (for local development)

### 1. Clone & Start
```bash
git clone <repository-url>
cd ScanNotesManager

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 2. Access the Application
- **Frontend**: http://localhost (professional UI)
- **Backend API**: http://localhost/api (with validation)
- **Direct Frontend**: http://localhost:5173 (development)
- **Direct Backend**: http://localhost:8080 (API only)

### 3. Test the Application
```bash
# Test validation (should return 400)
curl -X POST "http://localhost/api/scans/1/notes" \
  -H "Content-Type: application/json" \
  -d '{"title": "", "content": ""}'

# Test valid data (should return 201)
curl -X POST "http://localhost/api/scans/1/notes" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Note", "content": "Valid content"}'
```

## 🔄 Development Workflow

### Hot Reload Development
```bash
# Start with hot reload enabled
docker-compose up --build

# View real-time logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Individual Service Development
```bash
# Frontend only (with proxy to backend)
cd modules/frontend
npm install
npm run dev

# Backend only (with CORS for frontend)
cd modules/backend
dotnet restore
dotnet run
```

## 📡 API Endpoints

### Scans
- `GET /api/scans` - Get all scans
- `GET /api/scans/{id}/notes` - Get notes for a scan
- `POST /api/scans/{id}/notes` - Add a note to a scan

### Validation & Error Handling
- `400 Bad Request` - Validation errors with detailed messages
- `404 Not Found` - Non-existent scan IDs
- `201 Created` - Successfully created notes
- `500 Internal Server Error` - Server errors with proper logging

### Sample API Responses
```json
// GET /api/scans
[
  {
    "id": 1,
    "patientName": "John Doe",
    "scanDate": "2025-07-17T10:30:00Z",
    "scanType": "CT Chest"
  }
]

// POST /api/scans/1/notes (validation error)
{
  "message": "Validation failed",
  "errors": ["Title is required", "Content is required"],
  "statusCode": 400
}

// POST /api/scans/1/notes (success)
{
  "id": 4,
  "title": "Test Note",
  "content": "Valid content",
  "createdAt": "2025-07-17T07:08:09.1430778Z",
  "scanId": 1
}
```

## 🧪 Testing

### Manual Testing
```bash
# Frontend testing
cd modules/frontend
npm test

# Backend testing
cd modules/backend
dotnet test

# API testing with curl
curl -X GET "http://localhost/api/scans"
curl -X GET "http://localhost/api/scans/1/notes"
```

### Validation Testing
```bash
# Test empty fields (should return 400)
curl -X POST "http://localhost/api/scans/1/notes" \
  -H "Content-Type: application/json" \
  -d '{"title": "", "content": ""}'

# Test non-existent scan (should return 404)
curl -X POST "http://localhost/api/scans/999/notes" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "content": "Test"}'
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Stop and remove containers
docker-compose down

# View logs for specific service
docker-compose logs -f [frontend|backend|nginx]

# Rebuild specific service
docker-compose build [service-name]

# Access container shell
docker-compose exec [service-name] sh

# Check container status
docker-compose ps
```

## 🔧 Configuration

### Environment Variables
- `PROJECT_NAME=scan_notes_manager` - Docker container prefix

### Frontend Configuration
- **Vite proxy**: `/api` → `http://localhost:8080`
- **Hot reload**: Enabled for development
- **TypeScript**: Strict mode enabled
- **ESLint**: Modern React and TypeScript rules

### Backend Configuration
- **CORS**: Configured for `localhost` development
- **Validation**: DataAnnotations with proper error messages
- **Logging**: Structured logging with request/response tracking
- **Port**: 8080 (changed from 5000 to avoid macOS conflicts)

### Completed Features
- ✅ **Modern React 19** with TypeScript
- ✅ **Professional state management** (TanStack Query + Zustand)
- ✅ **Comprehensive validation** (client + server)
- ✅ **Error boundaries** and global error handling
- ✅ **Optimistic updates** for better UX
- ✅ **Docker containerization** for deployment
- ✅ **Professional UI** with Tailwind design system
- ✅ **Hot reload development** experience

### Architectural Highlights
- **App Shell Pattern**: Professional layout with Header, Sidebar, MainContent
- **Error Resilience**: Multiple layers of error handling
- **Performance**: Optimized with caching and background updates
- **Scalability**: Component-based architecture for easy extension
- **Developer Experience**: Hot reload, TypeScript, and debugging tools

### Trade-offs & Assumptions
- **In-memory storage**: Simple but no persistence between restarts
- **Local development focus**: CORS configured for localhost
- **Single-user**: No authentication (focus on core functionality)

---

**Development Time**: 90 minutes for core implementation + 30 minutes for professional enhancements