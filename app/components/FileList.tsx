import React from "react";
import styles from "./home.module.scss";

interface FileListProps {
  files?: File[];
  currentUser: string;
  onSelectedChange: (file: File, isSelected: boolean) => void;
  onDownload: () => void;
  onDelete: () => void;
}

const FileList: React.FC<FileListProps> = ({
  files = [],
  currentUser,
  onSelectedChange,
  onDownload,
  onDelete,
}) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    file: File,
  ) => {
    onSelectedChange(file, e.target.checked);
  };

  const handleDownloadButtonClick = () => {
    onDownload();
  };

  const handleDeleteButtonClick = () => {
    onDelete();
  };
  const filteredFiles = files.filter(
    (file) => file.name.startsWith(currentUser + "-"), // 只显示以当前用户姓名开头的文件，例如 "Alice-example.pdf"
  );
  return (
    <div className={styles.fileList}>
      {filteredFiles.map((file) => (
        <div key={file.name} className={styles.fileListItem}>
          <input
            type="checkbox"
            onChange={(e) => handleCheckboxChange(e, file)}
          />
          <span>{file.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FileList;
