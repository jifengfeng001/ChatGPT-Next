import React, { useState, useEffect } from "react";
import axios from "axios";
import BookmarkList from "./BookmarkList";
import { Simulate } from "react-dom/test-utils";
import input = Simulate.input;
import "./Bookmark.css";
import styles from "@/app/components/home.module.scss";

interface Bookmark {
  url: string;
  title: string;
}

const BookmarkApp = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const [newBookmarkUrl, setNewBookmarkUrl] = useState<string>("");
  const [newBookmarkTitle, setNewBookmarkTitle] = useState<string>("");

  const handleCancelBookmark = () => {
    setNewBookmarkUrl("");
    setNewBookmarkTitle("");
  };

  const handleSaveBookmark = async () => {
    try {
      const response = await axios.get(
        "https://cors-anywhere.herokuapp.com/" + newBookmarkUrl,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );
      const html = await response.data;
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const newBookmark: Bookmark = {
        url: newBookmarkUrl,
        title:
          newBookmarkTitle || (titleMatch ? titleMatch[1] : newBookmarkUrl),
      };
      setBookmarks([...bookmarks, newBookmark]);
      setNewBookmarkUrl("");
      setNewBookmarkTitle("");
    } catch (error) {
      console.error(error);
      return "";
    }

    //
    // const response = await fetch( newBookmarkUrl, {
    //     headers: {
    //         'model':'no-cors',
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    //         'Access-Control-Allow-Headers': 'Content-Type'
    //     }
    // });
  };

  const handleDeleteBookmark = (index: number) => {
    const newBookmarks = [...bookmarks];
    newBookmarks.splice(index, 1);

    setBookmarks(newBookmarks);
  };

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  return (
    <div className={styles.windowContent}>
      <div>
        <input
          type="text"
          placeholder="输入URL"
          value={newBookmarkUrl}
          onChange={(e) => setNewBookmarkUrl(e.target.value)}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={handleSaveBookmark}>收藏</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={handleCancelBookmark}>取消</button>
      </div>
      <BookmarkList
        bookmarks={bookmarks}
        onDeleteBookmark={handleDeleteBookmark}
      />
    </div>
  );
};

export default BookmarkApp;
