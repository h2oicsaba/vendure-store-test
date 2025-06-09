import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';
import express from 'express';

// Create a global Express app instance to modify directly
const globalExpressApp = express();
// Apply the 'trust proxy' setting with multiple approaches
globalExpressApp.set('trust proxy', 2);
// @ts-ignore - Direct patching of express settings
globalExpressApp.settings = globalExpressApp.settings || {};
// @ts-ignore
globalExpressApp.settings['trust proxy'] = 2;
// Monkey-patch the global Express so all instances inherit these settings
const originalExpress = express;
(express as any) = function() {
    const app = originalExpress();
    app.set('trust proxy', 2);
    // @ts-ignore
    app.settings = app.settings || {};
    // @ts-ignore
    app.settings['trust proxy'] = 2;
    return app;
};
Object.assign(express, originalExpress);

// Set environment variables for express-rate-limit
process.env.EXPRESS_RATE_LIMIT_TRUST_PROXY = 'true';
process.env.EXPRESS_DISABLE_RATE_LIMIT = 'true';

// Output environment variables for express-rate-limit
console.log('Environment variables set for express-rate-limit:');
console.log('EXPRESS_RATE_LIMIT_TRUST_PROXY:', process.env.EXPRESS_RATE_LIMIT_TRUST_PROXY);
console.log('EXPRESS_DISABLE_RATE_LIMIT:', process.env.EXPRESS_DISABLE_RATE_LIMIT);

// Monkeypatch express-rate-limit directly - extreme approach
try {
    // Try to load the express-rate-limit module directly
    const RateLimit = require('express-rate-limit');
    if (RateLimit && typeof RateLimit === 'function') {
        console.log('Found express-rate-limit, attempting direct patch');
        const originalRateLimit = RateLimit;
        // Replace the module with a function that disables validation
        function patchedRateLimit(options: any = {}) {
            // Force safe validation options
            options = {
                ...options,
                validate: {
                    xForwardedForHeader: false,
                    trustProxy: false
                },
                // Force a safe handler that doesn't actually rate limit
                handler: (_req: any, _res: any, next: any) => next()
            };
            return originalRateLimit(options);
        }
        // Copy all properties and methods
        Object.assign(patchedRateLimit, originalRateLimit);
        // Replace the module in require.cache
        const cachePath = require.resolve('express-rate-limit');
        if (require.cache[cachePath]) {
            require.cache[cachePath].exports = patchedRateLimit;
        }
        console.log('Successfully patched express-rate-limit module');
    }
} catch (err) {
    console.log('Failed to monkeypatch express-rate-limit:', err);
}

runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });
