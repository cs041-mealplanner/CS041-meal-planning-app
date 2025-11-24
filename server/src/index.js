// src/index.js
// Server entry point
// -------------------------------
// Starts the HTTP server in normal runtime.
// Tests import the app from app.js instead,
// so we don’t start a real server during Vitest runs.

import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
