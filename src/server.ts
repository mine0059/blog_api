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
import { logger } from '@/lib/winston';

/**
 * Custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';

/**
 * Router
 */
import v1Routes from '@/routes/v1';

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
            logger.warning(`CORS error: ${origin} is not allowed by CORS`);
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


/**
 * Immediately Invoke Async Function Expression (IIFE) to start the server.
 * 
 * - Tries to connect to the database before initializing the server.
 * - Defines the API routes (`/api/v1`).
 * - Start the server on the specified PORT and logs the running URL.
 * - If error occurs during startup, its is logged, and the process exist with status 1.
 */
(async () => {
    try {
        await connectToDatabase();
        app.use('/api/v1', v1Routes);

        app.listen(config.PORT, () => {
            logger.info(`Server running: http://localhost:${config.PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start the server', error);

        if(config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();

/**
 * Handles server shutdown gracefully by disconnecting fromthe database.
 * 
 * - Attempting to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - if an error occurs during disconnection, it is logged to the console.
 * - Exist the process with status code `0` (indicating a successful shutdown).
 */
const handleServershutdown = async () => {
    try {
        await disconnectFromDatabase();
        logger.warn('Server SHUTDOWN');
        process.exit(0);
    } catch (error) {
        logger.error('Error during server shutdown', error);
    }
}

/**
 * Listens for termination signals ('SIGTERM' AND `SIGINT`).
 * 
 * - `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupt the process (e.g., pressing `Ctrl + C`).
 * - when either signal is received, 'handleServerShurdown' is executed to ensure proper cleanup.
 */
process.on('SIGTERM', handleServershutdown);
process.on('SIGINT', handleServershutdown);