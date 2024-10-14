import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Use 'cb' instead of 'cd'
  },
  filename: (req, file, cb) => {
    if (file) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname); // Use 'file' instead of 'files[0]'
    }
  },
});

// Initialize multer with the storage configuration and file filter
export const upload = multer({
  storage: storage,
  // Optional: Limits the file size to 5MB
  // limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file) {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
      }
    }
  },
});
