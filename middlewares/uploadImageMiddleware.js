const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // solution 1 DiskStorage
  // const mulStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "./uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const extention = file.mimetype.split("/")[1];
  //     const fileNmae = `category-${uuidv4()}-${Date.now()}.${extention}`;
  //     cb(null, fileNmae);
  //   },
  // });

  // Solution 2 MemoryStorage
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("you can upload only images", 404), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImages = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImage = (arrOfFields) => multerOptions().fields(arrOfFields);
