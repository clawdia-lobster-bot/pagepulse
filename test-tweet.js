const { TwitterApi } = require('twitter-api-v2');
(async () => {
  const client = new TwitterApi({
    appKey: 'IwIDwVerDCYCZI08EIJ4xTx6D',
    appSecret: 'Y9Woru1JXZj1FsS1Wba8Y3Z7nJX5pWyBUuP8dPdv8jmkGpa9hE',
    accessToken: '2026717602266099713-TG4Q8wN4RCQFRW6tBaSYdLn6KSyiNk',
    accessSecret: 'u2ALHO3VQMNgAmVC1M5hj2QdIGFjmflwbEMluEKdqHYx2'
  });
  try {
    await client.v1.tweet(`Most websites are leaking traffic because of broken SEO basics.\n\nWe're building PagePulse — an AI tool that audits your site weekly and tells you exactly what to fix.\n\nDrop your URL below and we'll audit it for free when we launch 👇\n\n#SEO #indiehackers #buildinpublic`);
    console.log('Tweet sent successfully (OAuth 1.0a)');
  } catch (e) {
    console.error('OAuth 1.0a tweet fail:', e.message);
    process.exit(2);
  }
})();
