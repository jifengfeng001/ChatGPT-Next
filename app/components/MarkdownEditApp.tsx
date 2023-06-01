import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Tabs } from "antd";

export interface MarkdownFile {
  id: string;
  name: string;
  content: string;
}
const MarkdownEditor = ({
  files,
  updateFiles,
  selectedFile,
  setSelectedFile,
}: {
  files: MarkdownFile[];
  updateFiles: React.Dispatch<React.SetStateAction<MarkdownFile[]>>;
  selectedFile: MarkdownFile | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<MarkdownFile | null>>;
}) => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (selectedFile) {
      setMarkdown(selectedFile.content);
    }
  }, [selectedFile]);

  const handleMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMarkdown(event.target.value);

    if (selectedFile) {
      const updatedFile = { ...selectedFile, content: event.target.value };
      const updatedFiles = files.map((file) =>
        file.id === selectedFile.id ? updatedFile : file,
      );
      updateFiles(updatedFiles);
      setSelectedFile(updatedFile);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      const updatedFile = { ...selectedFile, content: markdown };
      const updatedFiles = files.map((file) =>
        file.name === selectedFile.name ? updatedFile : file,
      );
      if (updatedFiles.length > 0) {
        updateFiles(updatedFiles);
        localStorage.setItem(
          "markdown-file-" + selectedFile.name,
          selectedFile.content,
        );
        //const fileArray = Array.from(updatedFiles);
        //fileArray.forEach((file) => localStorage.setItem("markdown-file"+file.name, file.content));
      } else {
        localStorage.setItem(
          "markdown-file-" + selectedFile.name,
          selectedFile.content,
        );
        const updatedFiles = files.push(selectedFile);
        updateFiles(files);
        //const fileArray = Array.from(files);
        //fileArray.forEach((file) => localStorage.setItem("markdown-file"+file.name, file.content));
      }
    }
  };

  return (
    <div>
      <textarea
        style={{ width: "100%", height: "200px" }}
        value={markdown}
        onChange={handleMarkdownChange}
      />
      <button onClick={handleSave}>保存</button>
    </div>
  );
};

const MarkdownPreviewer = ({
  selectedFile,
}: {
  selectedFile: MarkdownFile | null;
}) => {
  return (
    <div>
      <ReactMarkdown>{selectedFile?.content ?? ""}</ReactMarkdown>
    </div>
  );
};

const MarkdownFileList = ({
  files,
  setSelectedFile,
  setActionTab,
}: {
  files: MarkdownFile[];
  setSelectedFile: React.Dispatch<React.SetStateAction<MarkdownFile | null>>;
  setActionTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleFileSelect = (file: MarkdownFile) => {
    setSelectedFile(file);
  };

  const handleFileDelete = (file: MarkdownFile) => {
    const updatedFiles = files.filter((f) => f.id !== file.id);

    localStorage.removeItem(file.name);
  };

  return (
    <div>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <label style={{ float: "left" }}>{file.name}</label>
            <button
              onClick={() => {
                handleFileSelect(file);
                setActionTab("1");
              }}
              style={{ float: "right", background: "#0080ff" }}
            >
              编辑
            </button>{" "}
            &nbsp;&nbsp;&nbsp;
            <button
              onClick={() => handleFileDelete(file)}
              style={{
                marginLeft: "unset",
                float: "right",
                background: "#0080ff",
              }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

type MarkdownAppProps = {
  initialFiles: MarkdownFile[];
};

const MarkdownApp = ({ initialFiles }: MarkdownAppProps) => {
  const [files, setFiles] = useState<MarkdownFile[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(
    initialFiles[0],
  );
  const [activeTab, setActiveTab] = useState<string>("1");
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const filename = localStorage.key(i);

      if (filename !== null && filename.startsWith("markdown-file")) {
        const filecontent = localStorage.getItem(filename);
        if (filecontent == null) {
          const file: MarkdownFile = {
            id: "",
            name: filename,
            content: "",
          };
          files.push(file);
        } else {
          const file: MarkdownFile = {
            id: "",
            name: filename,
            content: filecontent,
          };
          files.push(file);
        }
      }
    }
    const savedFiles = files;
  }, []);

  return (
    <Tabs activeKey={activeTab} onChange={handleTabChange}>
      <Tabs.TabPane tab="编辑" key="1">
        <MarkdownEditor
          files={files}
          updateFiles={setFiles}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="预览" key="2">
        <MarkdownPreviewer selectedFile={selectedFile}></MarkdownPreviewer>
      </Tabs.TabPane>
      <Tabs.TabPane tab="文件列表" key="3">
        <MarkdownFileList
          files={files}
          setSelectedFile={setSelectedFile}
          setActionTab={setActiveTab}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default MarkdownApp;
