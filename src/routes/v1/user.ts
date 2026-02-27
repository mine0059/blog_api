/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from "express";
import { param, query, body } from 'express-validator';

/**
 * middleware
 */
import authenticated from "@/middlewares/authenticated";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";

/**
 * Controllers
 */
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";
import getAllUser from "@/controllers/v1/user/get_all_user";
import getUserById from "@/controllers/v1/user/get_user_by_id";
import deleteUserById from "@/controllers/v1/user/delete_user_by_id";

/**
 * models
 */
import User from "@/models/user";

const router = Router();

router.get(
    '/current',
    authenticated,
    authorize(['admin', 'user']),
    getCurrentUser,
);

router.put(
    '/current',
    authenticated,
    authorize(['admin', 'user']),
    body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less then 20 characters')
    .custom(async (value) => {
        const userExists = await User.exists({ username: value });

        if (userExists) {
            throw Error('This username is already in use');
        }
    }),
    body('email')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Email must be less then 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
        const userExists = await User.exists({ email: value });

        if (userExists) {
            throw Error('This email is already in use');
        }
    }),
    body('password')
    .optional()
    .isLength({ max: 8 })
    .withMessage('Password must be at least 8 characters long'),
    body('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less then 20 characters'),
    body('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less then 20 characters'),
    body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('Url must be less then 100 characters'),
    
    validationError,
    updateCurrentUser,
);

router.delete(
    '/current',
    authenticated,
    authorize(['admin', 'user']),
    deleteCurrentUser,
);

router.get(
    '/',
    authenticated,
    authorize(['admin']),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 to 50'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a positive integer'),
    validationError,
    getAllUser,
)

router.get(
    '/:userId',
    authenticated,
    authorize(['admin']),
    param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
    validationError,
    getUserById,
)

router.delete(
    '/:userId',
    authenticated,
    authorize(['admin']),
    param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
    validationError,
    deleteUserById,
)


export default router;