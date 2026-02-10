# File Upload Feature Documentation

## Overview
The application now supports file attachments for tasks. Users can upload multiple documents (up to 5 files) when creating a new task, and can download or delete individual attachments.

## Features

### Upload Capabilities
- **Multiple Files**: Upload up to 5 files per task
- **File Size Limit**: Maximum 5MB per file
- **Supported Formats**:
  - Images: `.jpg`, `.jpeg`, `.png`, `.gif`
  - Documents: `.pdf`, `.doc`, `.docx`, `.txt`
  - Spreadsheets: `.xls`, `.xlsx`
  - Archives: `.zip`, `.rar`

### File Operations
1. **Upload**: Add attachments when creating a new task
2. **Download**: Download any attachment with its original filename
3. **Delete**: Remove individual attachments from a task
4. **Auto-cleanup**: Files are automatically deleted when a task is deleted

## Backend Implementation

### Configuration (`config/upload.js`)
- Uses Multer middleware for handling multipart/form-data
- Disk storage with unique filenames (timestamp + random string)
- File type validation using MIME types
- Automatic creation of `uploads/` directory

### Model Updates (`models/Task.js`)
Added `attachments` array to Task schema:
```javascript
attachments: [{
  filename: String,        // Stored filename (unique)
  originalName: String,    // Original uploaded filename
  path: String,           // File system path
  size: Number,           // File size in bytes
  mimetype: String,       // MIME type
  uploadedAt: Date        // Upload timestamp
}]
```

### API Endpoints

#### Upload Files
```
POST /api/tasks
Content-Type: multipart/form-data

FormData fields:
- title: string (required)
- description: string
- status: string
- priority: string
- dueDate: string (ISO date)
- attachments: File[] (max 5 files)
```

#### Download Attachment
```
GET /api/tasks/:taskId/attachments/:attachmentId
Response: Binary file data with original filename
```

#### Delete Attachment
```
DELETE /api/tasks/:taskId/attachments/:attachmentId
Response: { success: true, message: string }
```

### Security Features
- File type validation (whitelist approach)
- File size limits enforced
- Secure filename generation prevents path traversal
- Files stored outside web root
- Authentication required for all operations

## Frontend Implementation

### TaskForm Component
- File input with multiple file selection
- Client-side validation (file type and size)
- File preview showing selected files with sizes
- Remove individual files before upload
- Only available when creating new tasks (not for editing)

### TaskList Component
- Displays attachment count badge
- Shows list of all attachments with original names
- Download button for each attachment
- Delete button for each attachment with confirmation
- Responsive design with hover effects

### Task Service
- Handles FormData creation for file uploads
- Sets appropriate Content-Type headers
- Blob download with automatic link creation
- RESTful attachment management

## Usage Guide

### For Users

#### Uploading Files
1. Click "New Task" button on dashboard
2. Fill in task details (title, description, etc.)
3. Click "Choose Files" in the Attachments section
4. Select one or more files (max 5 files, 5MB each)
5. Review selected files in the preview
6. Remove any unwanted files by clicking the × button
7. Click "Create" to save the task with attachments

#### Downloading Files
1. Find the task with attachments in your task list
2. Locate the "Attachments" section at the bottom of the task card
3. Click the download icon (↓) next to the file you want
4. File will download with its original name

#### Deleting Files
1. Find the task with attachments
2. Click the delete icon (×) next to the file
3. Confirm deletion in the popup
4. File is permanently removed from the server

### For Developers

#### Backend Setup
```bash
cd backend
npm install multer
```

The `uploads/` directory is automatically created when the server starts.

#### Frontend Changes
No additional npm packages required. Uses native FormData API and Blob handling.

#### File Storage
Files are stored in:
```
backend/uploads/
├── 1234567890-abc123.pdf
├── 1234567891-def456.jpg
└── ...
```

## API Examples

### Create Task with Files (using curl)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Important Task" \
  -F "description=Task with documents" \
  -F "status=pending" \
  -F "priority=high" \
  -F "attachments=@/path/to/file1.pdf" \
  -F "attachments=@/path/to/file2.jpg"
```

### Download Attachment
```bash
curl -X GET http://localhost:5000/api/tasks/TASK_ID/attachments/ATTACHMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o downloaded-file.pdf
```

### Delete Attachment
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID/attachments/ATTACHMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Technical Details

### File Processing Flow
1. Client selects files → validates locally
2. FormData created with task data + files
3. Multer middleware processes upload
4. Files saved to disk with unique names
5. File metadata stored in MongoDB
6. Response returns task with attachment info

### Error Handling
- Invalid file types → rejected before upload
- File too large → 413 Payload Too Large
- Server errors → proper error messages
- Failed uploads → automatic cleanup
- Missing files on download → 404 Not Found

### Performance Considerations
- Files stored on disk (not in database)
- Streaming downloads for large files
- Lazy loading of file lists
- Efficient cleanup on task deletion

## Security Considerations

### Implemented Protections
✅ File type validation (MIME type checking)
✅ File size limits (5MB per file)
✅ Unique filename generation
✅ Path traversal prevention
✅ Authentication required
✅ User-owned files only

### Future Enhancements
- [ ] Virus scanning integration
- [ ] Cloud storage (AWS S3, Azure Blob)
- [ ] Image thumbnails
- [ ] File compression
- [ ] Batch download (ZIP)
- [ ] File versioning

## Troubleshooting

### Common Issues

**Files not uploading**
- Check file size (must be < 5MB)
- Verify file type is supported
- Ensure backend server is running
- Check browser console for errors

**Download not working**
- Verify attachment ID is correct
- Check authentication token
- Ensure file exists on server
- Check browser download settings

**Files missing after upload**
- Check `uploads/` directory exists
- Verify file permissions
- Check disk space
- Review server logs

## Testing

### Manual Testing Checklist
- [ ] Upload single file
- [ ] Upload multiple files (max 5)
- [ ] Upload different file types
- [ ] Test file size validation (> 5MB)
- [ ] Test unsupported file type
- [ ] Download attachment
- [ ] Delete attachment
- [ ] Delete task with attachments
- [ ] Edit task (should not show upload)

### Sample Test Data
Use these files for testing:
- Small PDF (< 1MB)
- Large PDF (> 5MB) - should fail
- JPG image
- Word document
- Executable file (.exe) - should fail

## Maintenance

### Backup Strategy
Important: Include `uploads/` directory in backup procedures:
```bash
# Backup uploads folder
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/

# Backup database (includes file metadata)
mongodump --db scalable-web --out backup/$(date +%Y%m%d)
```

### Cleanup Old Files
```javascript
// TODO: Implement periodic cleanup of orphaned files
// Files that exist on disk but not in database
```

### Monitoring
Monitor:
- Disk space usage in `uploads/` directory
- Failed upload attempts
- Download frequency
- File type distribution

## Future Improvements

### Planned Features
1. **Cloud Storage Integration**
   - AWS S3 or Azure Blob Storage
   - Reduces server storage burden
   - Better scalability

2. **Image Processing**
   - Automatic thumbnail generation
   - Image compression
   - Preview in browser

3. **Advanced Features**
   - Drag and drop upload
   - Upload progress bar
   - File preview before download
   - Batch operations

4. **Enhanced Security**
   - Virus scanning
   - Watermarking for documents
   - Encrypted storage

## Related Files

### Backend
- `config/upload.js` - Multer configuration
- `models/Task.js` - Task schema with attachments
- `controllers/taskController.js` - File handling logic
- `routes/taskRoutes.js` - Upload endpoints
- `server.js` - Static file serving

### Frontend
- `components/TaskForm.jsx` - Upload UI
- `components/TaskList.jsx` - Display attachments
- `services/taskService.js` - API calls
- `pages/Dashboard.jsx` - Integration

## Support

For issues or questions about the file upload feature:
1. Check server logs: `backend/logs/`
2. Verify file permissions on `uploads/` directory
3. Check MongoDB for attachment metadata
4. Review browser console for frontend errors
