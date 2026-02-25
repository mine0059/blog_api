/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { NextFunction, Request, Response } from "express";

const deleteUserById = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const userId = req.params.userId;

        await User.findByIdAndDelete(userId);

        logger.info('A user account has been deleted', {
            userId
        });

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });

        logger.error('Error while deleting a user', error);
    }
}

export default deleteUserById;