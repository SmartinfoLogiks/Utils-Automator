module.exports = {
  apps : [{
    name: 'SILK_Automator',
    script: 'index.js',
    instances : '1',
    watch: "plugins/*",
    max_memory_restart: '1024M',
    exec_mode : "cluster",
    env: {
        "NODE_ENV": "production"
    }
  }]
};
