"use client";

import React, { useState } from "react";

const Users = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [userPosts, setUserPosts] = useState([]); // State to store posts of the selected user

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedUser(null); // Clear the selected user
  };

  const fetchUserPosts = async (userId) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}/posts`
      );
      const data = await response.json();
      setUserPosts(data);
    } catch (error) {
      console.error("Error fetching posts from the selected user:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setIsModalOpen(true); // Open the modal
    fetchUserPosts(user.id); // Fetch posts of the selected user
  };

  return (
    <>
      {/* User List */}
      <div className="mx-auto max-w-4xl p-6 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleUserClick(user)}
            >
              <h2 className="text-xl font-semibold text-sky-500 hover:underline">
                {user.name}
              </h2>
              <p className="text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {user.phone}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedUser.name}
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Address:</strong>{" "}
              {`${selectedUser.address.suite}, ${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.zipcode}`}
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d971.9930288301224!2d124.00130726951305!3d12.973635306080302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU4JzI1LjEiTiAxMjTCsDAwJzA3LjAiRQ!5e0!3m2!1sen!2sph!4v1747497023588!5m2!1sen!2sph"
              width="440"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
            <h3 className="text-lg font-bold mt-4 text-gray-800">
              Posts by {selectedUser.name}
            </h3>
            <ul className="mt-2 space-y-2">
              {userPosts.map((post) => (
                <li key={post.id} className="bg-gray-100 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{post.title}</h4>
                  <p className="text-gray-600">{post.body}</p>
                </li>
              ))}
            </ul>
            <button
              className="mt-6 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 w-full"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
