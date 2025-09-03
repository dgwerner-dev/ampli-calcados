export default defineEventHandler(async event => {
  try {
    const envVars = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    };
    
    return {
      success: true,
      environment: envVars,
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});
