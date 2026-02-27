/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */
import { v2 as cloudinary } from "cloudinary";

import { logger } from "@/lib/winston";

import User from "@/models/user";
import Blog from "@/models/blog";

import type { NextFunction, Request, Response } from "express";

const deleteUserById = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const userId = req.params.userId;

        const blogs = await Blog.find({ author: userId })
                        .select('banner.publicId')
                        .lean()
                        .exec();
                        
        const publicIds = blogs.map(({ banner }) => banner.publicId );
        await cloudinary.api.delete_resources(publicIds);

        logger.info('Multiple blog banners deleted from Cloudinary', {
            publicIds
        });

        await Blog.deleteMany({ author: userId })
        logger.info('Multiple blogs deleted', {
            userId,
            blogs
        });

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