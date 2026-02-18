export const GET_ME = `
  query me {
    me {
      _id
      username
      email
      highscores {
        score
        date
      }
    }
  }
`;

export const GET_LEADERBOARD = `
  query leaderboard {
    leaderboard {
      highscores {
        score
        user
        date
      }
    }
  }
`;
