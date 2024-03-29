db = connect(`mongodb://localhost:27017`);

db = db.getSiblingDB(`babyteacher`);

db.createUser(
    {
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
        roles: [
            {
                role: "readWrite",
                db: "babyteacher"
            }
        ]
    }
);

db.createCollection("messages");
