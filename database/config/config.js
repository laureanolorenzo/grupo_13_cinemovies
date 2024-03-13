module.exports = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "cinemovies",
    "host": "127.0.0.1",
    "port": "8889",
    "dialect": "mysql",
    "logging": console.log
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
