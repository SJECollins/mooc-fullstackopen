import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create new blog entry</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={(event) => setTitle(event.target.value)}
          />
          <label htmlFor="author">Author: </label>
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={(event) => setAuthor(event.target.value)}
          />
          <label htmlFor="url">Url: </label>
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BlogForm;
