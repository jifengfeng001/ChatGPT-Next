import React from "react";
import Locale from "@/app/locales";
import DeleteIcon from "@/app/icons/delete.svg";
import { copyToClipboard } from "@/app/utils";
import { IconButton } from "@/app/components/button";
import "./Bookmark.css";
interface Bookmark {
  url: string;
  title: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDeleteBookmark: (index: number) => void;
}

const BookmarkList = ({ bookmarks, onDeleteBookmark }: BookmarkListProps) => {
  return (
    <ul>
      {bookmarks.map((bookmark, index) => (
        <li key={index}>
          <input type="checkbox" value={index} />

          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            {bookmark.title}
          </a>
          <IconButton
            key="delete"
            icon={<DeleteIcon />}
            bordered
            text={Locale.BookMark.Delete}
            onClick={() => onDeleteBookmark(index)}
          />
        </li>
      ))}
    </ul>
  );
};

export default BookmarkList;
