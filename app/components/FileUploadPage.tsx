import { useState, useEffect } from "react";
import FileList from "./FileList";
import FileUploader from "./FileUploader";
import styles from "./home.module.scss";

const FileUploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    // 从本地存储中加载文件列表
    const fileList: File[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const filename = localStorage.key(i);
      if (filename !== null) {
        fileList.push(new File([], filename));
      }
    }
    setFiles(fileList);
  }, []);

  const handleFileUpload = () => {
    // 上传完成，从本地存储中加载文件列表
    const fileList: File[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const filename = localStorage.key(i);
      if (filename !== null) {
        fileList.push(new File([], filename));
      }
    }
    setFiles(fileList);
  };

  const handleSelectedChange = (file: File, isSelected: boolean) => {
    // 更新文件的选中状态
    setFiles((prevFiles) =>
      prevFiles.map((prevFile) => {
        if (prevFile.name === file.name) {
          return new File([], prevFile.name, { type: prevFile.type });
        }
        return prevFile;
      }),
    );
  };

  const handleFileDownload = () => {
    // 下载所有选中的文件
    files.forEach((file) => {
      const isSelected = document.getElementById(
        `checkbox-${file.name}`,
      ) as HTMLInputElement;
      if (isSelected.checked) {
        const filename = file.name;
        const blob = new Blob([""], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const handleFileDelete = () => {
    // 删除所有选中的文件
    setFiles((prevFiles) =>
      prevFiles.filter((file) => {
        const isSelected = document.getElementById(
          `checkbox-${file.name}`,
        ) as HTMLInputElement;
        if (isSelected.checked) {
          localStorage.removeItem(file.name);
          return false;
        }
        return true;
      }),
    );
  };

  return (
    <div className={styles.windowContent}>
      <FileUploader onUpload={handleFileUpload} />

      <FileList
        files={files}
        currentUser={"test"}
        onSelectedChange={handleSelectedChange}
        onDownload={handleFileDownload}
        onDelete={handleFileDelete}
      />
    </div>
  );
};

export default FileUploadPage;
