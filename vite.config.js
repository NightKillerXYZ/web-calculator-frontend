// vite.config.js
export default {
  server: {
    proxy: {
      '/calculate': 'http://localhost:5000'
    }
  }
};
