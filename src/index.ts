import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

// Set this environment variable for express-rate-limit
process.env.TRUST_PROXY = 'true';

runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });
