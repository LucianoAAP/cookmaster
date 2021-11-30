const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, path.resolve(__dirname, '../../uploads'));
  },
  filename: (req, file, callback) => {
    const { id } = req.params;
    callback(null, `${id}.jpeg`);
  },
});

const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname) !== '.jpeg' && path.extname(file.originalname) !== '.jpg') {
    req.validFileError = { status: 403, message: 'Extension must be `jpeg` or `jpg' };
    return cb(null, false);
  }
  return cb(null, true);
};

const uploadRecipeImg = multer({ storage, fileFilter });

module.exports = { uploadRecipeImg };