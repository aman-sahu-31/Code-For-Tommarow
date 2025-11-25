import React, { useEffect, useState } from "react";

export default function SimplePostsApp() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("card"); // card | list
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const perPage = 6;

  // Fetch Posts
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.slice(0, 36)));
  }, []);

  // Delete Post
  const deletePost = (id) => {
    const newList = posts.filter((p) => p.id !== id);
    setPosts(newList);

    // Fix pagination empty page
    const totalPages = Math.ceil(newList.length / perPage);
    if (currentPage > totalPages) setCurrentPage(totalPages);

    // Close detail panel if the deleted post is opened
    if (detail?.id === id) setDetail(null);
  };

  // Pagination
  const start = (currentPage - 1) * perPage;
  const pagePosts = posts.slice(start, start + perPage);
  const totalPages = Math.ceil(posts.length / perPage);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Simple News App</h1>

      {/* Toggle View */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("card")}
          className={`px-4 py-2 rounded ${view === "card" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          Card View
        </button>

        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${view === "list" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          List View
        </button>
      </div>

      {/* ------------------------------
          CARD VIEW
      --------------------------------*/}
      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pagePosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 relative bg-white shadow">
              <button
                onClick={() => deletePost(post.id)}
                className="absolute top-1 right-1 text-red-500 text-xl"
              >
                ×
              </button>

              <h3
                onClick={() => setDetail(post)}
                className="font-bold mb-2 cursor-pointer"
              >
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">{post.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------
          LIST VIEW
      --------------------------------*/}
      {view === "list" && (
        <div>
          {pagePosts.map((post) => (
            <div
              key={post.id}
              className="flex justify-between items-center border rounded-lg p-4 mb-2 bg-white"
            >
              <div onClick={() => setDetail(post)} className="cursor-pointer">
                <div className="font-bold">{post.title}</div>
                <div className="text-sm text-gray-600">{post.body}</div>
              </div>

              <button
                onClick={() => deletePost(post.id)}
                className="text-red-500 text-xl"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------
          PAGINATION
      --------------------------------*/}
      <div className="flex gap-3 mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`px-4 py-2 rounded ${
              p === currentPage ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ------------------------------
          DETAIL PANEL
      --------------------------------*/}
      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-[400px]">
            <button
              onClick={() => setDetail(null)}
              className="text-2xl absolute top-3 right-3"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-3">{detail.title}</h2>
            <p className="text-gray-600 mb-5">{detail.body}</p>
            <button
              onClick={() => setDetail(null)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
