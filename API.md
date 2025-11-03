# REST API Documentation

## Overview

This API provides endpoints for managing boards and posts with built-in security features including input sanitization and validation.

## Base URL

```
http://localhost:3001/api
```

## Security Features

- **Helmet.js**: Security headers protection
- **Input Sanitization**: All HTML tags are stripped from user input to prevent XSS attacks
- **Input Validation**: Enforces data type, length, and required field constraints
- **CORS**: Configurable cross-origin resource sharing

## Endpoints

### 1. Get All Boards

Retrieve a list of all available boards.

**Endpoint:** `GET /api/boards`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "general",
      "description": "General discussion board",
      "createdAt": "2025-11-03T21:45:26.144Z"
    }
  ],
  "count": 3
}
```

**Example:**
```bash
curl http://localhost:3001/api/boards
```

---

### 2. Get Posts by Board

Retrieve all posts for a specific board, sorted by creation date (newest first).

**Endpoint:** `GET /api/posts?board=:boardName`

**Query Parameters:**
- `board` (required): Board name (1-50 characters)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Test Post",
      "content": "This is a test post",
      "board": "general",
      "author": "TestUser",
      "createdAt": "2025-11-03T21:46:53.408Z",
      "updatedAt": "2025-11-03T21:46:53.408Z"
    }
  ],
  "count": 1,
  "board": "general"
}
```

**Example:**
```bash
curl "http://localhost:3001/api/posts?board=general"
```

**Error Response (Missing board parameter):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "board",
      "message": "Board parameter is required"
    }
  ]
}
```

---

### 3. Create a New Post

Create a new post on a specific board with automatic HTML sanitization.

**Endpoint:** `POST /api/post`

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content goes here",
  "board": "general",
  "author": "Username (optional)"
}
```

**Field Constraints:**
- `title` (required): 1-200 characters
- `content` (required): 1-10,000 characters
- `board` (required): 1-50 characters, must match an existing board name
- `author` (optional): Max 100 characters, defaults to "Anonymous"

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Post Title",
    "content": "Post content goes here",
    "board": "general",
    "author": "Username",
    "createdAt": "2025-11-03T21:46:53.408Z",
    "updatedAt": "2025-11-03T21:46:53.408Z"
  },
  "message": "Post created successfully"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/post \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my post content",
    "board": "general",
    "author": "JohnDoe"
  }'
```

**Error Response (Validation Failed):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Error Response (Board Not Found):**
```json
{
  "success": false,
  "error": "Board not found"
}
```

---

## Security Examples

### XSS Attack Prevention

Input with malicious HTML/JavaScript is automatically sanitized:

**Request:**
```json
{
  "title": "<script>alert('XSS')</script>Malicious Post",
  "content": "<img src=x onerror=alert(1)>Dangerous content",
  "board": "technology",
  "author": "Hacker<script>"
}
```

**Response (All HTML stripped):**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "title": "Malicious Post",
    "content": "Dangerous content",
    "board": "technology",
    "author": "Hacker",
    "createdAt": "2025-11-03T21:46:58.541Z",
    "updatedAt": "2025-11-03T21:46:58.541Z"
  },
  "message": "Post created successfully"
}
```

---

## Available Boards

The following boards are available by default:

1. **general** - General discussion board
2. **technology** - Technology and programming
3. **random** - Random topics

---

## Error Handling

All endpoints return consistent error responses:

**Validation Errors (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "fieldName",
      "message": "Error description"
    }
  ]
}
```

**Not Found Errors (404):**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**Server Errors (500):**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Running the Server

```bash
# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

The server runs on port 3001 by default (configurable via PORT environment variable).

---

## Implementation Notes

- All string inputs are sanitized using `sanitize-html` to remove HTML tags
- Input validation is performed using `express-validator`
- Security headers are applied using `helmet`
- Data is currently stored in-memory (replace with database in production)
- Posts are automatically sorted by creation date (newest first)
