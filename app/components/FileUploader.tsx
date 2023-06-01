import React, { useState } from "react";
import "./FileUpload.css";

interface FileUploaderProps {
  onUpload: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUploadButtonClick = () => {
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      fileArray.forEach((file) =>
        localStorage.setItem("test-" + file.name, file.name),
      );
      setSelectedFiles(null);
      onUpload();
    }
  };

  return (
    <div>
      <label className="label">
        选择文件：
        <input
          type="file"
          className="input"
          multiple
          onChange={handleFileInputChange}
        />
      </label>

      <label> {selectedFiles?.item(0)?.name}</label>

      <button className="button" onClick={handleUploadButtonClick}>
        上传
      </button>
    </div>
  );
};

export default FileUploader;
