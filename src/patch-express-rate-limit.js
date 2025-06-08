/**
 * This file patches the express-rate-limit library to disable rate limiting
 * and avoid issues with Railway's Metal Edge Network proxies.
 */

console.log('🔧 PATCHING express-rate-limit to fix Railway Metal Edge Network issues');

// Force trust proxy to true globally
process.env.TRUST_PROXY = 'true';

// Try multiple approaches to patch express-rate-limit
try {
  // Approach 1: Direct monkey patching
  const originalModule = require('express-rate-limit');
  
  if (originalModule && typeof originalModule.rateLimit === 'function') {
    console.log('✅ Found express-rate-limit module, applying direct patch');
    
    // Create a no-op middleware
    const disabledMiddleware = (req, res, next) => {
      next();
    };
    disabledMiddleware.resetKey = () => {};
    
    // Replace the original function
    originalModule.rateLimit = (options) => {
      console.log('⚠️ Rate limiting is DISABLED by patch-express-rate-limit.js');
      return disabledMiddleware;
    };
    
    console.log('✅ Successfully patched express-rate-limit!');
  } else {
    console.log('⚠️ Could not patch express-rate-limit directly');
  }
  
  // Approach 2: Patch Express app to always trust proxies
  const http = require('http');
  const originalCreateServer = http.createServer;
  
  http.createServer = function(requestListener) {
    // Check if this is an Express app
    if (requestListener && typeof requestListener.set === 'function') {
      console.log('✅ Found Express app, setting trust proxy to true');
      requestListener.set('trust proxy', true);
    }
    return originalCreateServer.apply(this, arguments);
  };
  
  console.log('✅ Patched http.createServer to set trust proxy on Express apps');
  
  // Approach 3: Override the validation function
  const validationPath = require.resolve('express-rate-limit/dist/index.cjs');
  if (validationPath) {
    console.log('✅ Found express-rate-limit validation module');
    const rateLimitModule = require(validationPath);
    
    // Disable the X-Forwarded-For validation
    if (rateLimitModule.validations && rateLimitModule.validations.xForwardedForHeader) {
      rateLimitModule.validations.xForwardedForHeader = () => true;
      console.log('✅ Disabled X-Forwarded-For validation');
    }
  }
} catch (error) {
  console.error('❌ Error while patching express-rate-limit:', error);
}

console.log('🔧 Patch process completed');

