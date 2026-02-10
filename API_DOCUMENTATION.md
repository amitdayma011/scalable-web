# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Sign Up (Register New User)

**Endpoint:** `POST /api/auth/signup`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "bio": "Software Developer",
    "createdAt": "2026-02-10T10:00:00.000Z",
    "updatedAt": "2026-02-10T10:00:00.000Z"
  }
}
```

---

### 4. Update User Profile

**Endpoint:** `PUT /api/auth/profile`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "bio": "Senior Software Developer",
  "avatar": "https://example.com/avatar.jpg",
  "password": "newpassword123"
}
```

**Note:** All fields are optional. Only send fields you want to update.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Senior Software Developer"
  }
}
```

---

## Task Endpoints

### 5. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `search` (optional): Search in title and description
- `sortBy` (optional): Sort field (`createdAt`, `dueDate`, `priority`, `status`)
- `order` (optional): Sort order (`asc`, `desc`) - default: `desc`

**Examples:**
```
GET /api/tasks
GET /api/tasks?status=pending
GET /api/tasks?priority=high&status=in-progress
GET /api/tasks?search=meeting
GET /api/tasks?sortBy=dueDate&order=asc
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-02-15T00:00:00.000Z",
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-10T10:00:00.000Z",
      "updatedAt": "2026-02-10T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Review pull requests",
      "description": "Review pending PRs from team",
      "status": "pending",
      "priority": "medium",
      "dueDate": null,
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-10T09:00:00.000Z",
      "updatedAt": "2026-02-10T09:00:00.000Z"
    }
  ]
}
```

---

### 6. Get Single Task

**Endpoint:** `GET /api/tasks/:id`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-10T10:00:00.000Z",
    "updatedAt": "2026-02-10T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to access this task"
}
```

---

### 7. Create New Task

**Endpoint:** `POST /api/tasks`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: "Complete project documentation"
description: "Write comprehensive API documentation"
status: "pending"
priority: "high"
dueDate: "2026-02-15"
attachments: [File, File, ...] (optional, max 5 files, 5MB each)
```

**File Upload Constraints:**
- Maximum 5 files per task
- Maximum 5MB per file
- Allowed formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.pdf`, `.doc`, `.docx`, `.txt`, `.xls`, `.xlsx`, `.zip`, `.rar`

**Validation Rules:**
- `title`: Required, non-empty string
- `description`: Optional, string
- `status`: Optional, must be one of: `pending`, `in-progress`, `completed` (default: `pending`)
- `priority`: Optional, must be one of: `low`, `medium`, `high` (default: `medium`)
- `dueDate`: Optional, valid date
- `attachments`: Optional, array of files

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "attachments": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "filename": "1234567890-abc123.pdf",
        "originalName": "requirements.pdf",
        "path": "uploads/1234567890-abc123.pdf",
        "size": 245760,
        "mimetype": "application/pdf",
        "uploadedAt": "2026-02-10T10:00:00.000Z"
      }
    ],
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-10T10:00:00.000Z",
    "updatedAt": "2026-02-10T10:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Task title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

**Error Response (413 - File Too Large):**
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB"
}
```

---

### 8. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Task ID

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "dueDate": "2026-02-20"
}
```

**Note:** All fields are optional. Only send fields you want to update.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "completed",
    "priority": "low",
    "dueDate": "2026-02-20T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-10T10:00:00.000Z",
    "updatedAt": "2026-02-10T11:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to update this task"
}
```

---

### 9. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Task deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to delete this task"
}
```

---

## Attachment Endpoints

### 10. Download Attachment

**Endpoint:** `GET /api/tasks/:taskId/attachments/:attachmentId`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `taskId`: Task ID
- `attachmentId`: Attachment ID (from task attachments array)

**Success Response (200):**
- Binary file data with original filename
- Content-Disposition header set to download with original filename

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Attachment not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to access this task"
}
```

---

### 11. Delete Attachment

**Endpoint:** `DELETE /api/tasks/:taskId/attachments/:attachmentId`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `taskId`: Task ID
- `attachmentId`: Attachment ID (from task attachments array)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Attachment not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to delete this attachment"
}
```

---

## Error Responses

### Authentication Errors

**401 Unauthorized - No Token:**
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

**401 Unauthorized - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

### Server Errors

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Stack trace (only in development)"
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (not authorized for this resource) |
| 404 | Not Found |
| 413 | Payload Too Large (file size limit exceeded) |
| 500 | Internal Server Error |

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "status": "pending"
  }'
```

### Create Task with Files
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=New Task with Files" \
  -F "description=Task description" \
  -F "priority=high" \
  -F "status=pending" \
  -F "attachments=@/path/to/file1.pdf" \
  -F "attachments=@/path/to/file2.jpg"
```

### Download Attachment
```bash
curl -X GET http://localhost:5000/api/tasks/TASK_ID/attachments/ATTACHMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o downloaded-file.pdf
```

### Delete Attachment
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID/attachments/ATTACHMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider adding rate limiting middleware using packages like `express-rate-limit`.

## CORS Configuration

The API accepts requests from `http://localhost:5173` by default. To change this, update the `CLIENT_URL` in the backend `.env` file or modify the CORS configuration in `server.js`.

---

## Notes

- All timestamps are in ISO 8601 format
- JWT tokens expire after 7 days (configurable in `.env`)
- Passwords are hashed using bcrypt with 10 salt rounds
- MongoDB ObjectIds are used for all ID fields
- User can only access their own tasks (enforced by middleware)
