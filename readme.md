# /\*

                    MONGODB & MONGOOSE

===========================================================

1. What is MongoDB?

   - Database engine, NoSQL database (not relational)
   - Designed for large-scale data management
   - Optimized for fast DB operations
   - Focuses on data rather than queries

2. MongoDB Structure:

   - Database -> Collections (like tables) -> Documents (like records)
   - Documents can have different structures (schema-less)
   - Stored in BSON (Binary JSON) format
   - Supports nested objects & arrays (flexible)
     Example:
     {
     name: "Ram",
     age: 25,
     skills: ["JS", "Node", "MongoDB"],
     address: { city: "Delhi", pin: 110001 }
     }

3. Features:

   - Schema-less; different documents can have different fields
   - Data duplication allowed
   - Can embed data in other documents (manual, careful)
   - References preferred for scalable relationships

4. MongoDB Atlas (Cloud Setup):

   - Go to https://www.mongodb.com/, signup/signin
   - Create a new Cluster (M0 is free)
   - Security:
     - Create user with all permissions
     - IP whitelist: 0.0.0.0/0 for access from anywhere (or your IP)

5. Using MongoDB with Node.js:

   - Install driver: npm i --save mongodb
   - Create database.js:
     import { MongoClient } from "mongodb";
     const client = new MongoClient("your_connection_url");
     export async function connectMongo(callback){
     try {
     await client.connect();
     console.log("MongoDB Connected");
     callback(client);
     } catch(err) {
     console.error("Connection Failed", err);
     }
     }

6. Why NoSQL / MongoDB:

   - Works naturally with JSON-like documents
   - Focus on data, less on complex queries
   - Easily scalable for large apps

7. What is Mongoose?

   - ODM (Object Document Mapper) for MongoDB
   - Adds schema layer, validation, relationships
   - Cleaner CRUD operations
   - Works with Node.js apps

8. Mongoose Workflow:
   Data -> Collection -> Schema & Model -> Instance -> Queries

9. Using Mongoose:

   - Install: npm i --save mongoose
   - Connect in app.js:
     import mongoose from "mongoose";
     mongoose.connect("your_connection_url")
     .then(() => console.log("Mongoose Connected"))
     .catch(err => console.error(err));
   - Define schema & model:
     const userSchema = new mongoose.Schema({
     name: String,
     email: { type: String, required: true },
     age: Number
     });
     const User = mongoose.model("User", userSchema);
   - Create & save document:
     const user = new User({ name: "ram", email: "ram@mail.com", age: 22 });
     await user.save();

10. # Summary: - MongoDB: NoSQL, flexible, JSON-like, schema-less - MongoDB Driver: Direct, low-level connection - Mongoose: ODM, adds schemas, validation, relationships, cleaner code
    \*/

# /\*

               MONGODB vs MONGOOSE

===========================================================

1. What they are:

   - MongoDB Driver:
     - Official Node.js package to connect directly to MongoDB
     - Low-level API, works with JSON-like documents
     - No schema enforcement
   - Mongoose:
     - ODM (Object Document Mapper) library for MongoDB
     - Adds schema, models, validation, relationships
     - Higher-level abstraction over MongoDB driver

2. Schema & Structure:

   - MongoDB Driver:
     - Schema-less, documents can have any structure
   - Mongoose:
     - Enforces a schema (blueprint)
     - Ensures consistent structure and validation

3. Validation:

   - MongoDB Driver:
     - Manual validation required before saving data
   - Mongoose:
     - Built-in validation (required fields, min/max, regex, etc.)

4. Middleware / Hooks:

   - MongoDB Driver:
     - No lifecycle hooks
   - Mongoose:
     - Supports pre/post hooks on save, update, delete
     - Useful for tasks like hashing passwords before saving

5. Relationships:

   - MongoDB Driver:
     - Manual joins or aggregation needed for referencing other collections
   - Mongoose:
     - `populate()` simplifies referencing related documents

6. Code Simplicity / CRUD:

   - MongoDB Driver:
     db.collection("users").insertOne({ name: "ram" });
     db.collection("users").find().toArray();
   - Mongoose:
     const user = new User({ name: "ram" });
     await user.save();
     const users = await User.find();

7. When to use:
   - MongoDB Driver:
     - High-performance apps
     - Schema-less or highly dynamic data
     - Raw, fine-grained control over queries
   - Mongoose:
     - Structured applications (blogs, e-commerce, CMS)
     - Need validation, hooks, and relationships
     - Cleaner, more maintainable code

===========================================================
\*/
