// next.config.mjs
export default {
    async redirects() {
      return [
        {
          source: '/',          // Matches the root URL
          destination: '/Enter', // Redirects to /Enter
          permanent: true,       // Permanent redirect
        },
      ];
    },
  };
  