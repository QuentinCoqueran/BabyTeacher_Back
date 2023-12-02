db = connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_USERNAME}@localhost:27017/admin`);

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
