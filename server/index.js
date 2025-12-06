
import dotenv from "dotenv";
dotenv.config();
import mammoth from "mammoth";
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { processDocument } from './gemini.js';
import { storageService } from './storage.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory file processing using Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
app.get('/api/documents', async (req, res) => {
  try {
    const docs = await storageService.getAllDocuments();
    // Sort by newest
    docs.sort((a, b) => b.createdAt - a.createdAt);
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let fileContent = null;
    let isText = false;

    // DOCX handling
    if (req.file.originalname.endsWith(".docx")) {
      isText = true;
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      fileContent = result.value;
    }
    // Text-based files
    else if (
      req.file.mimetype.startsWith("text/") ||
      req.file.mimetype === "application/json" ||
      req.file.originalname.endsWith(".md") ||
      req.file.originalname.endsWith(".txt")
    ) {
      isText = true;
      fileContent = req.file.buffer.toString("utf-8");
    }
    // Binary files
    else {
      fileContent = req.file.buffer.toString("base64");
    }

    const newDoc = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      createdAt: Date.now(),
      status: 'processing',
      originalContent: fileContent,
      isbinary: !isText
    };

    const savedDoc = await storageService.saveDocument(newDoc);

    let summary = null;
    let markdown = null;

    if (isText) {
      const aiResponse = await processDocument(fileContent);
      summary = aiResponse.summary;
      markdown = aiResponse.markdown;
    } else {
      summary = "Binary document uploaded — AI summarization skipped.";
      markdown = "";
    }

    const updated = await storageService.updateDocument(savedDoc.id, {
      status: "completed",
      summary,
      markdown
    });

    res.json(updated);

  } catch (error) {
    console.error("Upload Error", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    await storageService.deleteDocument(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
