const SingleFile = require("../models/SingleFile");
const MultipleFile = require("../models/MultipleFile");
const User = require("../models/User");
const Post = require("../models/Post");
const { ObjectId } = require("mongodb");
const { error500, error400 } = require("../util/res");
const { cloudinary } = require("../util/cloudinary");
var fs = require("fs");
const { default: axios } = require("axios");
const singleFileUpload = async (req, res, next) => {
  try {
    let body = req.body;
    let uploadRes = null;
    if (req.file.mimetype.split("/")[0] === "image") {
      uploadRes = await cloudinary.uploader.upload(
        "uploads\\" + req.file.path.split("\\")[1],
        { upload_preset: "ml_default" }
      );
      axios
        .get(
          `http://localhost:3001/detection/2022-01-13T15-26-37.372Z-ttt-3388_qcdmae`
        )
        .then((response) => {
          console.log("ok");
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (req.file.mimetype.split("/")[0] === "video") {
      uploadRes = await cloudinary.uploader.upload(
        "uploads\\" + req.file.path.split("\\")[1],
        {
          resource_type: "video",
          chunk_size: 6000000,
          eager: [
            { width: 300, height: 300, crop: "pad", audio_codec: "none" },
            {
              width: 160,
              height: 100,
              crop: "crop",
              gravity: "south",
              audio_codec: "none",
            },
          ],
          eager_async: true,
          eager_notification_url: "https://mysite.example.com/notify_endpoint",
        },
        function (error, result) {
          console.log(result, error);
        }
      );
    } else {
      uploadRes = await cloudinary.uploader.upload(
        "uploads\\" + req.file.path.split("\\")[1],
        { resource_type: "auto" },
        function (error, result) {
          console.log(result, error);
        }
      );
    }
    // console.log(uploadRes);
    const file = {
      fileName: uploadRes.original_filename,
      filePath: uploadRes.public_id,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2), // 0.00
      tags: req.body.tags,
    };
    var filePathDelete = "uploads\\" + req.file.path.split("\\")[1];
    // console.log(file);
    await fs.unlinkSync(filePathDelete);
    res.status(200).send({ message: "File upload successfully", data: file });
  } catch (er) {
    console.log(er);
    res.status(400).send({ message: "error upload" });
  }
};

const multipleFileUpload = async (req, res, next) => {
  try {
    let filesArray = [];
    for (let i = 0; i < req.files.length; i++) {
      const element = req.files[i];
      const uploadRes = await cloudinary.uploader.upload(
        "uploads\\" + element.path.split("\\")[1],
        { upload_preset: "ml_default" }
      );
      const file = new SingleFile({
        fileName: uploadRes.original_filename,
        filePath: req.file.mimetype,
        fileType: element.mimetype,
        fileSize: fileSizeFormatter(element.size, 2), // 0.00
      });
      await file.save();
      filesArray.push(file._id);
    }
    const multipleFiles = new MultipleFile({
      title: req.body.title,
      files: filesArray,
    });
    await multipleFiles.save();
    res
      .status(200)
      .send({ message: "Files upload successfully", data: multipleFiles });
  } catch (er) {
    error400("upload error");
  }
};

const getAllFiles = async (req, res, next) => {
  try {
    const files = await SingleFile.find();
    res.json({
      message: "success",
      data: files,
    });
  } catch (er) {
    error400("get file error");
  }
};
const getAllMediaByUserId = async (req, res, next) => {
  try {
    const { userId } = req.query;
    let query = [];
    if (userId == req.userId) {
      //profile
      query = [{ poster: ObjectId(req.userId), status: 1 }];
    } else if (userId !== req.userId && userId) {
      let user = await User.findById(userId);
      let isFriend = user.friends.find((f) => f.user.toString() === req.userId);
      query = [{ poster: ObjectId(userId), audience: "public" }];
      if (!!isFriend) {
        query.push({ poster: ObjectId(userId), audience: "friends" });
      }
    }

    const result = await Post.find({ $or: query })
      .sort({ createAt: -1 })
      .populate("attachments");
    let listFile = [];
    console.log(result);
    for (const p of result) {
      listFile = listFile.concat(p.attachments);
    }

    res.json({
      message: "success",
      data: listFile,
    });
  } catch (er) {
    console.log(er);
    error400(res, "get file error");
  }
};

const updateTags = async (req, res) => {
  try {
    const { tags, filePath } = req.body;
    const rs = await SingleFile.findOneAndUpdate(
      { filePath: filePath },
      { tags: tags },
      { new: true }
    );
    console.log(rs);
    res.json({
      message: rs,
    });
  } catch (er) {
    error400("get file error");
  }
};

const getAllMultiFiles = async (req, res, next) => {
  try {
    const files = await MultipleFile.find().populate("files");
    console.log(files[0]);
    res.json({
      message: "success",
      data: files,
    });
  } catch (er) {
    error400("get file error");
  }
};

const fileSizeFormatter = (byte, decimal) => {
  if (byte === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(byte) / Math.log(1000));
  return (
    parseFloat((byte / Math.pow(1000, index)).toFixed(dm)) + "-" + sizes[index]
  );
};

module.exports = {
  singleFileUpload,
  multipleFileUpload,
  getAllFiles,
  fileSizeFormatter,
  getAllMediaByUserId,
  updateTags,
  getAllMultiFiles,
};
