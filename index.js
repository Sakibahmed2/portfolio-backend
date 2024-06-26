const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
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

    //create projects
    app.post("/api/v1/projects", async (req, res) => {
      const project = req.body;
      try {
        const result = await projectsCollection.insertOne(project);

        res.status(201).json({
          success: true,
          message: "Project created successfully",
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to create project",
          error,
        });
      }
    });

    // get all project
    app.get("/api/v1/projects", async (req, res) => {
      try {
        const result = await projectsCollection.find().toArray();

        res.status(200).json({
          success: true,
          message: "Projects retrieved successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve project",
          error: error.message,
        });
      }
    });

    //get single project
    app.get("/api/v1/projects/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const query = { _id: new ObjectId(id) };

        const result = await projectsCollection.findOne(query);

        res.status(200).json({
          success: true,
          message: "Projects retrieved successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve project",
          error: error.message,
        });
      }
    });

    //delete project
    app.delete("/api/v1/projects/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const quarey = { _id: new ObjectId(id) };
        const result = await projectsCollection.deleteOne(quarey);
        res.status(200).json({
          success: true,
          message: "Projects deleted successfully",
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to delete project",
          error: error.message,
        });
      }
    });

    // Update project by ID
    app.put("/api/v1/projects/:id", async (req, res) => {
      const projectId = req.params.id;
      const updatedProject = req.body;
      try {
        const filter = { _id: new ObjectId(projectId) };
        const updateDoc = {
          $set: updatedProject,
        };
        const result = await projectsCollection.updateOne(filter, updateDoc);
        res.status(200).json({
          success: true,
          message: "Project updated successfully",
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to update project",
          error: err.message,
        });
      }
    });

    //create blogs
    app.post("/api/v1/blogs", async (req, res) => {
      const blogs = req.body;
      try {
        const result = await blogsCollection.insertOne(blogs);

        res.status(201).json({
          success: true,
          message: "Blogs created successfully",
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to create blogs",
          error,
        });
      }
    });

    // get all blogs
    app.get("/api/v1/blogs", async (req, res) => {
      try {
        const result = await blogsCollection.find().toArray();

        res.status(200).json({
          success: true,
          message: "Blogs retrieved successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve Blogs",
          error: error.message,
        });
      }
    });

    //get single blog
    app.get("/api/v1/blogs/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const query = { _id: new ObjectId(id) };

        const result = await blogsCollection.findOne(query);

        res.status(200).json({
          success: true,
          message: "Blog retrieved successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve blog",
          error: error.message,
        });
      }
    });

    // Update blog by ID
    app.put("/api/v1/blogs/:id", async (req, res) => {
      const blogId = req.params.id;
      const updateBlog = req.body;
      try {
        const filter = { _id: new ObjectId(blogId) };
        const updateDoc = {
          $set: updateBlog,
        };
        const result = await blogsCollection.updateOne(filter, updateDoc);
        res.status(200).json({
          success: true,
          message: "Blog updated successfully",
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to update blog",
          error: err.message,
        });
      }
    });

    //delete blog
    app.delete("/api/v1/blogs/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const quarey = { _id: new ObjectId(id) };
        const result = await blogsCollection.deleteOne(quarey);
        res.status(200).json({
          success: true,
          message: "Blog deleted successfully",
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to delete blog",
          error: error.message,
        });
      }
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
