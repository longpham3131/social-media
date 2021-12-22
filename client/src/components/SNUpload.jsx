import React, { useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getUrlImage } from "@/util/index";

export default function SNUpload({
  isImagePost = true,
  onUploadSuccess,
  fileProp,
}) {
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.info("Bạn chỉ có thể upload hình ảnh thôi.");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.info("Hãy thử với dung lượng nhỏ hơn nào.");
    }
    return isJpgOrPng && isLt2M;
  };
  // const [avatar, setAvatar] = useState(fileProp);
  const [loading, setLoading] = useState(false);
  const handleChangeAvatar = ({ file }) => {
    setLoading(true);
    if (file.status === "done") {
      // setAvatar(file?.response?.data?.filePath);
      console.log(file.originFileObj);
      onUploadSuccess(file);
      setLoading(false);
    } else if (file.status === "error") {
      setLoading(false);
      message.error("Tải ảnh không thành công");
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://uploadfile0510.herokuapp.com/api/upload/singleFile"
      beforeUpload={beforeUpload}
      onChange={handleChangeAvatar}
    >
      {fileProp ? (
        <img
          src={
            isImagePost
              ? getUrlImage(fileProp.file ?? fileProp.filePath)
              : getUrlImage(fileProp)
          }
          alt="avatar"
          className="w-full h-full"
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}