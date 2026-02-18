import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";

const GameOverStats = ({ gameState }) => {
  const currentScore = gameState.score;

  const [isHighScore, setIsHighScore] = useState({
    user: false,
    leaderboard: false,
  });


  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" sx={{ mt: 10, p: 2 }}>
        {isHighScore.user ? <span>Personal highscore!</span> : ""}
        <br />
        {isHighScore.leaderboard ? <span> You Made the Leaderboard!</span> : ""}
      </Typography>
      <Typography variant="subtitle1" align="center">
        Final Score: {currentScore}
      </Typography>
    </Container>
  );
};

export default GameOverStats;
