module.exports = {
  apps: [
    {
      name: 'y-api',
      script: 'npm',
      exec_mode: 'fork', // 解决日志丢失问题
      args: 'run start',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
