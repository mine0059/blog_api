/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from "express";
import { param, body } from 'express-validator';

/**
 * middleware
 */
import authenticated from "@/middlewares/authenticated";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validationError";

/**
 * Controllers
 */
import commentBlog from "@/controllers/v1/comments/comment_blog";
import getCommentsByBlog from "@/controllers/v1/comments/get_comments_by_blog";
import deleteCommentById from "@/controllers/v1/comments/delete_comment_by_id";


const router = Router();

router.post(
    '/blog/:blogId',
    authenticated,
    authorize(['admin', 'user']),
    param('blogId').isMongoId().withMessage('Invalid blog ID'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),
    validationError,
    commentBlog
);

router.get(
    '/blog/:blogId',
    authenticated,
    authorize(['admin', 'user']),
    param('blogId').isMongoId().withMessage('Invalid blog ID'),
    validationError,
    getCommentsByBlog
);

router.delete(
    '/:commentId',
    authenticated,
    authorize(['admin', 'user']),
    param('commentId').isMongoId().withMessage('Invalid comment ID'),
    validationError,
    deleteCommentById,
);

export default router;