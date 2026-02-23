/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { Router } from "express";
import { body, cookie } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * Controllers
 */
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refresh_token";
import logout from "@/controllers/v1/auth/logout";

/**
 * Middlewares
 */
import validationError from "@/middlewares/validationError";
import authenticated from "@/middlewares/authenticated";

/**
 * Models
 */
import User from "@/models/user";

const router = Router();

// register
router.post(
    '/register', 
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error('User email or password is invalid');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isString()
        .withMessage('Role must be a string')
        .isIn(['admin', 'user'])
        .withMessage('Role must be either admin or user'),
    validationError,
    register
);

//login
router.post(
    '/login', 
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (!userExists) {
                throw new Error('User email or password is invalid');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .custom(async (value, { req }) => {
            const { email } = req.body as { email: string };
            const user = await User.findOne({email})
            .select('password')
            .lean()
            .exec();
            if (!user) {
                throw new Error('User email or password is invalid');
            }

            const passwordMatch = await bcrypt.compare(value, user.password);

            if (!passwordMatch) {
                throw new Error('User email or password is invalid')
            }
        }),
    validationError,    
    login
);

// refresh token
router.post(
    '/refresh-token',
    cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('invalid refresh token'),
    validationError,
    refreshToken
);

// logout
router.post(
    '/logout',
    authenticated, 
    logout
);

export default router;