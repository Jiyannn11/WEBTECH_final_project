"use client";

import React, { useState } from "react";
import { toast } from "sonner";

const NewsFeed = ({ posts, users, setRawComments, rawComments }) => {
  const [likes, setLikes] = useState([]);
  const [commentsModal, setCommentsModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [commentCache, setCommentCache] = useState({}); // Cache comments by postId

  const handleViewComments = (post) => {
    setSelectedPost(post);
    setCommentsModal(true);

    // Check if we have cached comments for this post
    if (commentCache[post.id]) {
      // Use cached comments
      setComments(commentCache[post.id]);
    } else {
      // Fetch comments if not cached
      fetchComments(post.id);
    }
  };

  const closeModal = () => {
    setCommentsModal(false);
    setSelectedPost(null);
    setComment("");
  };

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || { name: "Unknown User" };
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      const apiComments = await response.json();

      // Update comments state and cache
      setComments(apiComments);
      setCommentCache((prev) => ({
        ...prev,
        [postId]: apiComments,
      }));
    } catch (error) {
      console.error("Error fetching comments for the selected post:", error);
      toast.error("Failed to load comments. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }

    // Find highest ID to ensure new comment appears at top
    const maxId =
      Math.max(
        ...rawComments.map((c) => c.id),
        ...comments.map((c) => c.id),
        0
      ) + 1000;

    // Create the new comment
    const newComment = {
      id: maxId,
      postId: selectedPost.id,
      name: "You",
      email: "you@example.com",
      body: comment,
    };

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Posting your comment...",
      success: "Comment posted successfully!",
      error: "Failed to post comment",
    });

    // Add to global comments
    setRawComments((prev) => [newComment, ...prev]);

    // Add to current comments display
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);

    // Update the cache to include this new comment
    setCommentCache((prev) => ({
      ...prev,
      [selectedPost.id]: updatedComments,
    }));

    setComment("");
  };

  return (
    <>
      <div className="mx-auto max-w-4xl p-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-6">
          {posts.map((post) => {
            const author = getUserById(post.userId);

            return (
              <li
                key={post.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold mr-3">
                    {author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{author.name}</p>
                    <p className="text-gray-500 text-sm">{author.email}</p>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-sky-500 hover:underline mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600">{post.body}</p>
                {likes.includes(post.id) && (
                  <div className="flex items-center gap-2 py-1.5 text-sky-600 font-medium transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>1</span>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    {likes.includes(post.id) ? (
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-600 rounded-full font-medium transition-all"
                        onClick={() => {
                          setLikes((prevLikes) =>
                            prevLikes.filter((id) => id !== post.id)
                          );
                          toast("Unliked post");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Liked</span>
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-sky-50 text-gray-500 hover:text-sky-600 rounded-full font-medium transition-all"
                        onClick={() => {
                          setLikes((prevLikes) => [...prevLikes, post.id]);
                          toast.success("Post liked!");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>Like</span>
                      </button>
                    )}
                  </div>

                  <button
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-sky-50 text-gray-500 hover:text-sky-600 rounded-full font-medium transition-all"
                    onClick={() => handleViewComments(post)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span>Comments</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Comments Modal */}
      {commentsModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Comments on "{selectedPost.title}"
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                {selectedPost.userId && (
                  <>
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold mr-2">
                      {getUserById(selectedPost.userId).name.charAt(0)}
                    </div>
                    <span className="font-medium">
                      {getUserById(selectedPost.userId).name}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600 mb-2">{selectedPost.body}</p>
            </div>

            <h3 className="text-lg font-bold border-b pb-2 mb-4">
              {comments.length} Comments
            </h3>

            {comments.length > 0 ? (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold mr-3">
                        {comment.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {comment.name}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                          {comment.email}
                        </p>
                        <p className="text-gray-600">{comment.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                Loading comments...
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                rows="3"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsFeed;
