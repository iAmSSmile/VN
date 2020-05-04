module.exports = {
  apps : [{
    name: "www",
    script: "./bin/www",
    env: {
      NODE_ENV: "stage",
      HOSTNAME: "top-tax.online"
    }
  }]
}