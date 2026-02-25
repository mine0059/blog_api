/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { NextFunction, Request, Response } from "express";

const deleteCurrentUser = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const userid = req.userId;
    try {
        await User.deleteOne({ _id: userid });
        logger.info('A user account has been deleted', {
            userid
        });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });

        logger.error('Error while deleting current user', error);
    }
}

export default deleteCurrentUser;