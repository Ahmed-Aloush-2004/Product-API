import { log } from "console";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteImage = (imageUrl) => {
  try {
    // Extract the filename from the URL
    const filename = imageUrl.split("/uploads/")[1];

    // Build the full path to the image file on the server
    const filePath = path.join(__dirname, "..", "uploads", filename);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File ${filename} deleted successfully.`);
    } else {
      console.log(`File ${filename} does not exist.`);
    }
  } catch (error) {
    throw new Error("Error deleting the file:", error.message);
  }
};
