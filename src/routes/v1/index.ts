/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "API is live",
        status: 'Ok',
        version: '1.0.0',
        docs: 'https://docs.blog-api.oghenemine.com',
        timestamp: new Date().toISOString(),
    });
});

export default router;