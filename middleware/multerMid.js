import multer from "multer";
import path from "path";
import fs from "fs";
import { log } from "console";

// Define the storage with a dynamic destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Logic to determine the folder name based on backend logic
    let folder = "uploads"; // Default folder

    if (req.imageFolder) {
      folder = `uploads/${req.imageFolder}`;
    }

    // Construct the destination folder path
    const folderPath = path.join(folder);

    log(folderPath);

    if (!fs.existsSync(folderPath)) {
      try {
        fs.mkdirSync(folderPath, { recursive: true });
      } catch (error) {
        return cb(new Error("Failed to create directory: " + error.message));
      }
    }
    // Pass the folder path to the callback
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    if (file) {
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 10000000);
      const sanitizedFileName = file.originalname.replace(/\s+/g, "-"); // Replace spaces with dashes
      cb(null, `${uniqueSuffix}-${sanitizedFileName}`);
    }
  },
});

// Initialize multer with the storage configuration and file filter
export const upload = multer({
  storage: storage,
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

export function imageUploadFolder(FolderName, isMultipule = false) {
  return (req, res, next) => {
    req.imageFolder = FolderName;
    return isMultipule
      ? upload.array("image")(req, res, next)
      : upload.single("image")(req, res, next);
  };
}

// import multer from "multer";
// import path from "path";
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Use 'cb' instead of 'cd'
//   },
//   filename: (req, file, cb) => {
//     if (file) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, uniqueSuffix + "-" + file.originalname); // Use 'file' instead of 'files[0]'
//     }
//   },
// });

// // Initialize multer with the storage configuration and file filter
// export const upload = multer({
//   storage: storage,
//   // Optional: Limits the file size to 5MB
//   // limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (file) {
//       const fileTypes = /jpeg|jpg|png|gif/;
//       const extname = fileTypes.test(
//         path.extname(file.originalname).toLowerCase()
//       );
//       const mimetype = fileTypes.test(file.mimetype);

//       if (extname && mimetype) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
//       }
//     }
//   },
// });
