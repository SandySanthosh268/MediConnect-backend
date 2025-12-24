import express from 'express';
import { uploadDocument } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/appointments/:id/upload', protect, upload.single('file'), uploadDocument);

export default router;
