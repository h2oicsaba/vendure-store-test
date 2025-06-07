import express from 'express';

/**
 * Configure Express application with necessary settings for production deployment
 */
export function configureExpress(app: express.Application): void {
    // Enable trust proxy for Railway and other cloud providers
    app.set('trust proxy', true);
    
    // Add any other Express configuration here
    console.log('Express configured with trust proxy enabled');
}
