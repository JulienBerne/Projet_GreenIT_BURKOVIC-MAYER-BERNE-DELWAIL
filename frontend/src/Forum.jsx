import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Box,
} from "@mui/material";

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !userName.trim()) {
      alert("Title and user name are required.");
      return;
    }

    const requestBody = { title, content, userName };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "Failed to create post");
        return;
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setTitle("");
      setContent("");
      setUserName("");
      setError(null);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Forum
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <TextField
          label="Your Name"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Content (optional)"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Post
        </Button>
      </form>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography color="text.secondary">
                  {post.content || "No content"}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  By: {post.author?.name || "Unknown"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Forum;
