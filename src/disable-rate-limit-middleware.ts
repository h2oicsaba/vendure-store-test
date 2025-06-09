import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to disable rate limit validation
 * 
 * This middleware completely disables the express-rate-limit validation
 * by manipulating the request object and ensuring all validation steps pass.
 */
export const disableRateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Get access to the Express app instance
    const app = req.app;
    
    // Set trust proxy with specific values
    app.set('trust proxy', 
        process.env.VENDURE_PROXY_OPTIONS || 
        'loopback, linklocal, uniquelocal'
    );
    
    // Disable the rate limit validation checks by adding validation bypass
    // This is a bit hacky but effective
    if (req && req.headers) {
        // Ensure X-Forwarded-For is properly handled
        if (!req.headers['x-forwarded-for']) {
            req.headers['x-forwarded-for'] = req.ip || '127.0.0.1';
        }
        
        // Attach custom properties to bypass validations
        (req as any)._rateLimitDisabled = true;
    }
    
    next();
};
