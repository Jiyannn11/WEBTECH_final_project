"use client";

import Dashboard from "@/components/Dashboard";
import Headers from "@/components/Headers";
import NewsFeed from "@/components/NewsFeed";
import Users from "@/components/Users";
import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments"
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPosts(), fetchComments(), fetchUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Headers selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      {selectedPage === "users" && <Users users={users} />}
      {selectedPage === "news feed" && (
        <NewsFeed
          posts={posts}
          users={users}
          setRawComments={setComments}
          rawComments={comments}
        />
      )}
      {selectedPage === "home" && (
        <Dashboard posts={posts} users={users} comments={comments} />
      )}
    </>
  );
};

export default HomePage;
