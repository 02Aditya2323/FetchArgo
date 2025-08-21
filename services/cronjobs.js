const { fetchAndStoreArgoData } = require("./fetchArgo.js");

console.log('🔄 Starting auto-fetch service. Will fetch data every 5 seconds...');

const fetchInterval = setInterval(async () => {
  try {
    console.log('⏳ Fetching new Argo data...');
    await fetchAndStoreArgoData();
    console.log('✅ Fetch completed successfully. Next fetch in 5 seconds...');
  } catch (error) {
    console.error('❌ Error during fetch:', error.message);
  }
}, 5000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping auto-fetch service...');
  clearInterval(fetchInterval);
  process.exit(0);
});

module.exports = fetchInterval;