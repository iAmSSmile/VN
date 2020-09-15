module.exports = {
  apps : [{
    name: "www",
    script: "./bin/www",
    env: {
      NODE_ENV: "production",
      HOSTNAME: "top-tax.ru"
    }
  }]
};