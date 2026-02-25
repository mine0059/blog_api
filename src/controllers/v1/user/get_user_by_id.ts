/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { logger } from "@/lib/winston";
import config from "@/config";

import User from "@/models/user";

import type { NextFunction, Request, Response } from "express";

const getUserById = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId)
            .select('-__v')
            .exec();

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });

        logger.error('Error while getting a user', error);
    }
}

export default getUserById;