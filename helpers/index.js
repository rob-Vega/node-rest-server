const dbValidator = require("./db-validators");
const generateJWT = require("./generate-jwt");
const googleVerify = require("./google-verify");
const uploadFiles = require("./upload-file");

module.exports = {
  ...dbValidator,
  ...generateJWT,
  ...googleVerify,
  ...uploadFiles,
};
