const { v4: uuidv4 } = require("uuid");

const path = require("path");

const uploadFiles = (
  files,
  validExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const nameSliced = file.name.split(".");
    const extension = nameSliced[nameSliced.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(
        `${extension} is not a valid extension, valid extensions: ${validExtensions}`
      );
    }

    const tempName = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = { uploadFiles };
