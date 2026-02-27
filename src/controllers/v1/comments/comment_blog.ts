/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */
import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';

import { logger } from "@/lib/winston";

import Comment from "@/models/comment";
import Blog from "@/models/blog";


import type { Request, Response } from "express";
import type { IComment } from '@/models/comment';

type commentData = Pick<IComment, 'content'>;

/**
 * Purify the comment content
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (req: Request, res: Response) : Promise<void> => {
    const { blogId } = req.params;
    const { content } = req.body as commentData;
    const userId = req.userId;
    try {
        const blog = await Blog.findById(blogId)
                .select('_id commentsCount')
                .exec();

        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }

        const cleanContent = purify.sanitize(content);

        const newComment = await Comment.create({
            blogId,
            content: cleanContent,
            userId,
        });

        logger.info('New comment created', newComment);

        blog.commentsCount++;
        
        await blog.save();
        
        logger.info('Blog comments count updated', {
            blogId: blog._id,
            CommentCount: blog.commentsCount,
        });

        res.status(201).json({
            comment: newComment,
        });

    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });

        logger.error('Error during commenting in blog', error);
    }
}

export default commentBlog;