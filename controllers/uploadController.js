// simple controller for handling file uploads
const uploadFile = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  // return path to file
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
};

module.exports = { uploadFile };