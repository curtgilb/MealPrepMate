import fs from "fs";

const filePath =
  "/Users/curtgilbert/MealPrepMate/server/data/seed_data/units.csv";

console.log(`Attempting to access file: ${filePath}`);

// Check if the file exists
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`File does not exist: ${err.message}`);
    return;
  }
  console.log("File exists");
});

// Try to read the file
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }
  console.log("File content (first 100 characters):");
  console.log(data.slice(0, 100));
});

// Get file stats
fs.stat(filePath, (err, stats) => {
  if (err) {
    console.error(`Error getting file stats: ${err.message}`);
    return;
  }
  console.log("File stats:");
  console.log(`Size: ${stats.size} bytes`);
  console.log(`Permissions: ${stats.mode}`);
  console.log(`Last modified: ${stats.mtime}`);
});
