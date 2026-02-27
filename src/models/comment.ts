/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { Schema, model, Types } from "mongoose";

export interface IComment {
    blogId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
}


const commentShema = new Schema<IComment>({
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Content is requried'],
        maxLength: [1000, 'Content must be less then 1000 characters'],
    }
});

export default model<IComment>('Comment', commentShema);