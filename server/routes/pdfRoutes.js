const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const router = express.Router();

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

router.post("/extract-text", upload.single("pdfFile"), async (req, res) => {
  try {

    console.log(req.file);
    

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    console.log(pdfBuffer); // Print the extracted text to the console.
    const data = await pdfParse(pdfBuffer);

    // Cleanup the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ text: data.text });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
});

module.exports = router;
