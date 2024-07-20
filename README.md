## Welcome to Kicka: The Table Football Matchmaking Platform

Kicka is a matchmaking web application designed to rank the best table football players. Whether you're a seasoned player or just starting out, Kicka provides a platform for competitive matches and accurate skill assessment.

To experience Kicka firsthand, visit [Kicka](https://kicka.vercel.app).

### Features

- Play 1v1 or 2v2 matches.
- Enter the results of your games directly into the app.
- The app calculates and assigns a skill rating to each player.
- View your global ranking among all players.

## Getting Started with Development

Kicka is built with [Next.js](https://nextjs.org/) and utilizes [Vercel Serverless Postgres](https://vercel.com/storage/postgres). If you prefer to use your own PostgreSQL database, you'll need to modify the database adapter and provide your credentials.

For authentication, Kicka supports login via Google or Github accounts. If you wish to deploy your own instance of the server, you'll need to obtain Google OAuth and/or Github credentials.

### Setup Instructions

1. Install dependencies:

   ```bash
   bun install
   ```

2. Run the development server:

   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application locally.

### Font Optimization

This project utilizes [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load the Inter font, a custom Google Font, enhancing the visual experience for users.
