const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { information } = require("./utils/info");
const fse = require("fs-extra");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  fse.emptyDir("./public/uploads", (err) => {
    if (err) {
      console.error("Error emptying uploads folder:", err);
    } else {
      console.log("uploads folder emptied successfully");
    }
  });
  try {
    if (!req.file) {
      res.status(400).json({ error: "Please Upload File!!" });
      return;
    }
    const pathx = req.file.destination + "/" + req.file.filename;
    console.log(pathx);
    const result = await information(pathx);
    console.log(result);
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(result));
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!!" });
    console.log(err);
  }
  res.end();
});

app.get("/status", (req, res) => {
  res.json({ status: "Server is running" });
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
