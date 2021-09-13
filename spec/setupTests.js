const fs = require("fs");
const vm = require("vm");

global.localStorage = {
  removeItem: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
};
window = global;
window.open = jest.fn();

const location = { href: "https://example.com", hash: "" };
window.location = location;
const globalContext = vm.createContext(global);

[
  "src/bbcore.js",
  "src/modules/bbcore.api.js",
  "src/modules/bbcore.auth.js",
  "src/modules/bbcore.contacts.js",
  "src/modules/bbcore.email.js",
  "src/modules/bbcore.extras.js",
  "src/modules/bbcore.helpers.js",
  "src/modules/bbcore.video.js",
  "src/modules/bbcore.videoRecorder.js",
].forEach((file) => {
  const content = fs.readFileSync(file);
  const parts = file.split("/");
  vm.runInContext(content, globalContext, {
    filename: parts[parts.length - 1],
  });
});
