const appJson = require('./app.json');

module.exports = ({ config }) => {
  const baseConfig = appJson?.expo ?? {};

  return {
    expo: {
      ...baseConfig,
      extra: {
        ...baseConfig.extra,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      },
    },
  };
};
