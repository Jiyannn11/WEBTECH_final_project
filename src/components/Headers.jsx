import React from "react";
import Image from "next/image";

const Headers = ({ selectedPage, setSelectedPage }) => {
  return (
    <header className="bg-sky-500">
      <nav
        className="mx-auto flex max-w-4xl items-center justify-between p-6 lg:px-8 sticky top-0"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="text-2xl text-white">
              {selectedPage === "home"
                ? "Dashboard"
                : selectedPage === "users"
                ? "User Directory"
                : "News Feed"}
            </span>
          </a>
        </div>
        <div className="flex space-x-4">
          <a
            href="#home"
            className={`text-white ${
              selectedPage === "home" ? "font-bold" : ""
            }`}
            onClick={() => setSelectedPage("home")}
          >
            Home
          </a>
          <a
            href="#users"
            className={`text-white ${
              selectedPage === "users" ? "font-bold" : ""
            }`}
            onClick={() => setSelectedPage("users")}
          >
            Users
          </a>
          <a
            href="#news-feed"
            className={`text-white ${
              selectedPage === "news feed" ? "font-bold" : ""
            }`}
            onClick={() => setSelectedPage("news feed")}
          >
            News Feed
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Headers;
