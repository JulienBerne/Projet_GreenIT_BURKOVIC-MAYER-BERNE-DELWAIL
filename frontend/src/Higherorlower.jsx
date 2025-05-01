import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Box,
  TextField
} from "@mui/material";

const HigherOrLower = () => {
  const [gameOver, setGameOver] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const fetchUserNames = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user names");
      }

      const users = await response.json();
      const names = users.map((user) => user.name);
      setName(names);
      return names;
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

  const saveScore = async () => {
    if (!name) {
      alert("Please enter your name to save your score.");
      return;
    }

    try {
      let newUserNames = await fetchUserNames();
      let userID = null;
      const existingUser = newUserNames.find((newUserNames) => newUserNames === name);
      if (existingUser) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users?name=${name}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user ID for existing user");
        }
        const users = await response.json();

        if (users.length > 0) {
          const user = users[0];
          userID = user.id;
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!response.ok) {
          console.error("Failed to create new user:", response.status, response.statusText);
          throw new Error("Failed to create new user");
        }
        const newUser = await response.json();
        userID = newUser.id;
      }

      const scoreResponse = await fetch(`${import.meta.env.VITE_API_URL}/scores/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userID, value: score }),
      });

      if (!scoreResponse.ok) {
        throw new Error("Failed to save score");
      }

      alert("Score saved successfully!");
      setName("");
      setScore(0);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    setGameOver(true);
  };

  const fetchRandomItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/items/random`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch random items");
      }
      const randomItems = await response.json();
      setItems(randomItems);
    } catch (error) {
      console.error("Error fetching random items:", error);
    }
  };

  const startGame = () => {
    fetchRandomItems();
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
  };

  const handleGuess = (guess) => {
    const leftValue = items[0].value;
    const rightValue = items[1].value;

    if (
      (guess === "higher" && rightValue > leftValue) ||
      (guess === "lower" && rightValue < leftValue)
    ) {
      setScore(score + 100);
      fetchRandomItems(); // Load new items
    } else {
      handleGameOver(score);
    }
  };

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Higher or Lower
      </Typography>
      {gameStarted && !gameOver && (
        <Typography variant="subtitle1" gutterBottom>
          Is the item on the right higher or lower than the item on the left?
        </Typography>
      )}
      {gameOver ? (
        <Box>
          <Typography variant="h5">Game Over! Your Score: {score}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <TextField
              label="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              sx={{ width: "300px" }}
            />
            <Button variant="contained" color="primary" onClick={saveScore} sx={{ marginTop: 2 }}>
              Save Score
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {gameStarted && items.length === 2 ? (
            <Box>
              <Typography variant="h6">Score: {score}</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={items[0].img}
                    alt="Item 1"
                  />
                  <CardContent>
                    <Typography variant="h6">Item 1</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={items[1].img}
                    alt="Item 2"
                  />
                  <CardContent>
                    <Typography variant="h6">Item 2</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Button variant="contained" color="secondary" onClick={() => handleGuess("lower")}>
                  Lower
                </Button>
                <Button variant="contained" color="primary" sx={{ marginLeft: 2 }} onClick={() => handleGuess("higher")}>
                  Higher
                </Button>
              </Box>
            </Box>
          ) : (
            <Button variant="contained" color="primary" onClick={startGame}>
              Start Game
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HigherOrLower;
