module.exports = {
    "type": "postgres",
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "host": process.env.DB_HOST,
    "database": process.env.DB_DATABASE,
    "port": 5432,
    "synchronize": true,
    "logging": false,
    "entities": ["src/entity/*.{js,ts}"],
    "migrations": ["src/migration/*.{js,ts}"],
    "subscribers": ["src/subscriber/*.{js,ts}"],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
};
