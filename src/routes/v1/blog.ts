/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from "express";
import { param, query, body } from 'express-validator';
import multer from "multer";

/**
 * middleware
 */
import authenticated from "@/middlewares/authenticated";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validationError";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";

/**
 * Controllers
 */
import createBlog from "@/controllers/v1/blog/create_blog";
import getAllBlogs from "@/controllers/v1/blog/get_all_blogs";
import getBlogsByUser from "@/controllers/v1/blog/get_blog_by_user";
import getBlogBySlug from "@/controllers/v1/blog/get_blog_by_slug";
import updateBlog from "@/controllers/v1/blog/update_blog";
import deleteBlog from "@/controllers/v1/blog/delete_blog";

const upload = multer();

const router = Router();

router.post(
    '/',
    authenticated,
    authorize(['admin']),
    upload.single('banner_image'),
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less then 180 characters'),
    body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
    body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or publised'),
    validationError,
    uploadBlogBanner('post'),
    createBlog
);

router.get(
    '/',
    authenticated,
    authorize(['admin', 'user']),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 to 50'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a positive integer'),
    validationError,
    getAllBlogs,
);

router.get(
    '/user/:userId',
    authenticated,
    authorize(['admin', 'user']),
    param('userId').isMongoId().withMessage('Invalid user ID'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 to 50'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a positive integer'),
    validationError,
    getBlogsByUser,
);

router.get(
    '/:slug',
    authenticated,
    authorize(['admin', 'user']),
    param('slug').notEmpty().withMessage('Slug is required'),
    validationError,
    getBlogBySlug,
);

router.put(
    '/:blogId',
    authenticated,
    authorize(['admin']),
    param('blogId').isMongoId().withMessage('Invalid blog ID'),
    upload.single('banner_image'),
    body('title')
    .trim()
    .optional()
    .isLength({ max: 180 })
    .withMessage('Title must be less then 180 characters'),
    body('content'),
    body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or publised'),
    validationError,
    uploadBlogBanner('put'),
    updateBlog
);

router.delete(
    '/:blogId',
    authenticated,
    authorize(['admin']),
    param('blogId').isMongoId().withMessage('Invalid blog ID'),
    validationError,
    deleteBlog
)


export default router;