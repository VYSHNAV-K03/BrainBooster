// backend/server.js
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const upload = require("./middleware/multer");
const axios = require("axios");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

console.log("hi");

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin")); // Admin routes
app.use("/api/courses", require("./routes/courses"));
app.use("/api/sections", require("./routes/sections")); // Add this line
// app.use('/api/mentor', require('./routes/mentor'));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/entry-tests", require("./routes/entryRoute"));
app.use("/api/exam", require("./routes/entryRouteExam"));
app.use("/api/pdf", require("./routes/pdfRoutes"));
app.use("/api/review", require("./routes/reviews"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.post("/api/extract-pdf-text", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);

    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    res.status(500).json({ error: "Failed to extract text" });
  }
});

app.post("/recommend-books", async (req, res) => {
  try {
    const { courseName, courseDescription } = req.body;
    if (!courseName || !courseDescription) {
      return res
        .status(400)
        .json({ error: "Course name and description are required" });
    }

    // Call Coherent API
    const response = await axios.post(
      "https://api.coherent.com/recommend-books", // Replace with actual Coherent API URL
      { course: courseName, description: courseDescription },
      { headers: { Authorization: `Bearer ${process.env.COHERENT_API_KEY}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch book recommendations" });
  }
});

app.get("/api/books", async (req, res) => {
  const { query } = req.query; // Get subject from request query

  console.log(query);

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${query}&limit=10`
    );
    const books = response.data.docs.map((book) => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(", ") : "Unknown",
      year: book.first_publish_year || "N/A",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
    }));

    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
