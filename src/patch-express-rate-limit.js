/**
 * Direct patcher for express-rate-limit library
 * 
 * This script directly modifies the express-rate-limit package to bypass 
 * the X-Forwarded-For validation that's causing problems in Railway's Metal Edge network.
 */

try {
  // Find the express-rate-limit module path
  const path = require.resolve('express-rate-limit');
  
  // Load the module
  const rateLimit = require('express-rate-limit');
  
  // Check if the module has a validate property with xForwardedForHeader function
  if (rateLimit && rateLimit.validate && typeof rateLimit.validate.xForwardedForHeader === 'function') {
    console.log('[PATCH] Found express-rate-limit module, patching X-Forwarded-For validation');
    
    // Replace the validation function with a function that always returns true
    rateLimit.validate.xForwardedForHeader = () => true;
    
    console.log('[PATCH] Successfully patched express-rate-limit X-Forwarded-For validation!');
  } else {
    console.log('[PATCH] Could not find express-rate-limit validation function - skip patching');
  }
} catch (err) {
  console.error('[PATCH] Error patching express-rate-limit:', err);
}
