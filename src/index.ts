import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

// Set environment variables for express-rate-limit
process.env.EXPRESS_RATE_LIMIT_TRUST_PROXY = 'true';
process.env.EXPRESS_DISABLE_RATE_LIMIT = 'true';

// Log environment variables for debugging
console.log('Environment variables set for express-rate-limit:');
console.log('EXPRESS_RATE_LIMIT_TRUST_PROXY:', process.env.EXPRESS_RATE_LIMIT_TRUST_PROXY);
console.log('EXPRESS_DISABLE_RATE_LIMIT:', process.env.EXPRESS_DISABLE_RATE_LIMIT);

runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });
