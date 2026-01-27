export default () => ({
  app: {
    port: parseInt(process.env.PORT || '4000', 10) || 4000,
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  },
  admin: {
    secret: process.env.ADMIN_SECRET,
  },
  supabase: {
    projectUrl: process.env.SUPABASE_PROJECT_URL,
    publishableApiKey: process.env.SUPABASE_PUBLISHABLE_API_KEY,
    secretApiKey: process.env.SUPABASE_SECRET_API_KEY,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
});
