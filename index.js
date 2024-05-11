const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");
    const skillsCollection = db.collection("skills");
    const projectsCollection = db.collection("projects");
    const blogsCollection = db.collection("blogs");

    //create skills
    app.post("/api/v1/skills", async (req, res) => {
      const { title, icon } = req.body;
      const result = await skillsCollection.insertOne({ title, icon });

      res.status(201).json({
        success: true,
        message: "Skills created successfully",
        data: result,
      });
    });

    //get all skills
    app.get("/api/v1/skills", async (req, res) => {
      try {
        const result = await skillsCollection.find().toArray();

        res.status(200).json({
          success: true,
          message: "Skills retrieved successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve skills",
          error: error.message,
        });
      }
    });

    //get single product
    app.get("/api/v1/products/:id", async (req, res) => {
      const { id } = req.params;

      const query = { _id: new ObjectId(id) };

      const result = await productsCollection.findOne(query);

      res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: result,
      });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});