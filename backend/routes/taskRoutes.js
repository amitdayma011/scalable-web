import express from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  downloadAttachment,
  deleteAttachment,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

// Validation rules
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
];

// All routes are protected
router.use(protect);

router.route('/').get(getTasks).post(taskValidation, upload.array('attachments', 5), createTask);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

router.route('/:id/attachments/:attachmentId').get(downloadAttachment).delete(deleteAttachment);

export default router;
