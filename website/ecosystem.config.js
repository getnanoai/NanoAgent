module.exports = {
  apps: [{
    name: 'nanoagent-website', // App name in PM2
    script: 'node_modules/.bin/next', // Direct binary path
    args: 'start', // Runs 'next start'
    env: {
      NODE_ENV: 'production',
      PORT: 3005      // Fixed port for NanoAgent (minizebra is on 3004)
    },
    instances: 1,      // Keep as 1, or change to 'max' for cluster mode
    exec_mode: 'fork', // Change to 'cluster' if instances > 1
    watch: false,      // Disabled to prevent unwanted restarts
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
