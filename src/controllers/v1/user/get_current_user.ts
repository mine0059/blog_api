/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Get endpoint hitted');
    try {
        const userid = req.userId;

        const user = await User.findById(userid).select('-__v').lean().exec();

        res.status(200).json({
            user,
        });

    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });

        logger.error('Error while getting current user', error);
    }
}

export default getCurrentUser;