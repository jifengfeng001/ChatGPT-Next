import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownFile {
  id: string;
  name: string;
  content: string;
}

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    const savedFiles = localStorage.getItem("markdown-files");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("markdown-files", JSON.stringify(files));
  }, [files]);

  const handleMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMarkdown(event.target.value);

    if (selectedFile) {
      const updatedFile = { ...selectedFile, content: event.target.value };
      const updatedFiles = files.map((file) =>
        file.id === selectedFile.id ? updatedFile : file,
      );
      //updateFiles(updatedFiles);
      const fileArray = Array.from(updatedFiles);
      fileArray.forEach((file) =>
        localStorage.setItem("markdown-files-" + file.name, file.name),
      );
    }
  };

  const handleSaveFile = () => {
    const id = Date.now().toString();
    const name = prompt("请输入文件名：") || "未命名";
    const content = markdown;
    const newFile: MarkdownFile = { id, name, content };
    setFiles([...files, newFile]);
    setSelectedFile(newFile);
  };

  const handleFileSelect = (file: MarkdownFile) => {
    setSelectedFile(file);
    setMarkdown(file.content);
  };

  const handleFileDelete = (file: MarkdownFile) => {
    const updatedFiles = files.filter((f) => f.id !== file.id);
    setFiles(updatedFiles);
    setSelectedFile(null);
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(event.target.value);
  };

  const handleRenameFile = () => {
    if (selectedFile) {
      const updatedFile = { ...selectedFile, name: newFileName };
      const updatedFiles = files.map((file) =>
        file.id === selectedFile.id ? updatedFile : file,
      );
      setFiles(updatedFiles);
      setSelectedFile(updatedFile);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "100%" }}>
        <textarea
          style={{ width: "100%", height: "50%" }}
          value={markdown}
          onChange={handleMarkdownChange}
        />
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      <div style={{ width: "0%" }}>
        <h2>文件列表</h2>
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <button onClick={() => handleFileSelect(file)}>
                {file.name}
              </button>
              <button onClick={() => handleFileDelete(file)}>删除</button>
            </li>
          ))}
        </ul>
        {selectedFile && (
          <div>
            <h2>编辑文件</h2>
            <input
              type="text"
              value={newFileName}
              onChange={handleFileNameChange}
            />
            <button onClick={handleRenameFile}>重命名</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
