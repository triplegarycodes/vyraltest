const appJson = require('./app.json');

module.exports = ({ config }) => {
  const baseConfig = appJson?.expo ?? {};

  return {
    expo: {
      ...baseConfig,
    },
  };
};
