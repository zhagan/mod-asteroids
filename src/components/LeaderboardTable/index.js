import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

function createData(userName, score) {
  return { userName, score };
}

export default function LeaderboardTable() {
  // Placeholder for leaderboard data
  let rows = [];

  // Example static data (replace with real data source if needed)
  const highscores = [
    { user: 'Player1', score: 1000 },
    { user: 'Player2', score: 900 },
    { user: 'Player3', score: 800 },
    // ...more static scores...
  ];

  highscores.forEach((score) => {
    rows.push(createData(score.user, score.score));
    return rows;
  });

  return (
    <TableContainer component={Box}>
      <Table>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.userName}</TableCell>
              <TableCell>{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
