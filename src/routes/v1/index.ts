/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { Router } from "express";

const router = Router();

/**
 * Routes
 */
import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';
import blogRoutes from '@/routes/v1/blog';
import likesRoutes from '@/routes/v1/likes';
import commentsRoutes from '@/routes/v1/comment';

/**
 * Root route
 */


router.get('/', (req, res) => {
    res.status(200).json({
        message: "API is live",
        status: 'Ok',
        version: '1.0.0',
        docs: 'https://docs.blog-api.oghenemine.com',
        timestamp: new Date().toISOString(),
    });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/likes', likesRoutes);
router.use('/comments', commentsRoutes);

export default router;