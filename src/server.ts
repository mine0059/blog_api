/**
 * @copyright 2026 oghenemine emmanuel
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

const app = express();

// configure CORS options
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            // Reject request from non-whitelisted origins
            callback(
                new Error(`CORS error: ${origin} is not allowed by CORS`),
                false,
            );
            console.log(`CORS error: ${origin} is not allowed by CORS`);
        }
    }
}

// apply cors middleware
app.use(cors(corsOptions));

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode 
// `extended: true` allows rich objects and arrays via querystring library
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//Enable response compression to reduce payload size and improve performance
app.use(
    compression({
        threshold: 1024, // Only compress responses layer then 1KB
    }),
);

// Use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive request and enhanvce security
app.use(limiter);

(async () => {
    try {
        app.get('/', (req, res) => {
            res.json({
                message: "Hello world",
            });
        })

        app.listen(config.PORT, () => {
            console.log(`Server running: http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.log('Failed to start the server', error);

        if(config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();