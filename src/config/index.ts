/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ['https://docs.blog-api.oghenemine.com'],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}

export default config;