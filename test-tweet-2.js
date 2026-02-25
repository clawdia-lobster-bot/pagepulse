const { TwitterApi } = require('twitter-api-v2');
(async () => {
  const client = new TwitterApi({
    clientId: 'VUxrYXRvdWltN0lBZWFVNG5GRkM6MTpjaQ',
    clientSecret: 'uovwmdecq16Pltb7gNgRD6V4YcrP3UIx7XOfxnoU3sW6u-6h_L'
  });
  try {
    // OAuth2 can only tweet on behalf of a user after authorization.
    // Since tokens aren't available and user flow is needed, print guidance.
    console.log('OAuth2 flow requires user redirect; cannot proceed headless.');
    process.exit(99);
  } catch (e) {
    console.error('OAuth2 tweet fail:', e.message);
    process.exit(2);
  }
})();
