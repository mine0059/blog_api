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
import likeBlog from "@/controllers/v1/likes/like_blog";
import unlikeBlog from "@/controllers/v1/likes/unlike_blog";

/**
 * Controllers
 */


const router = Router();

router.post(
    '/blog/:blogId',
    authenticated,
    authorize(['admin', 'user']),
    param('blogId').isMongoId().withMessage('Invalid blog ID'),
    body('userId')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId()
        .withMessage('Invalid user ID'),
    validationError,
    likeBlog
);

router.delete(
    '/blog/:blogId',
    authenticated,
    authorize(['admin', 'user']),
    param('blogId').isMongoId().withMessage('Invalid blog ID'),
    body('userId')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId()
        .withMessage('Invalid user ID'),
    validationError,
    unlikeBlog
);

export default router;