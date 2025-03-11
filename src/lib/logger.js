export function logError(error, context, metadata = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      context,
      metadata,
    };
  
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error(`[${context}] Error:`, error, metadata);
    }
  
    // Here you could add additional logging services like Sentry
    // or send to your own logging endpoint
  }