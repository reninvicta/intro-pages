# intro-pages

A minimal next.js app that I created out of boredom as an alternative to sites such as guns.lol and Carrd. Supports editable profiles and anonymous message-boxes via a backend MongoDB instance along with Discord integration, configurable via `.env`.

## Tech stack
- Next.js + React
- TypeScript + Tailwind CSS 4
- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- MongoDB backend

## Running the app
### Dev server
To run it locally, it's as easy as creating a `.env` file and specifying the following:
```env
MONGODB_URI=[A link to your MongoDB instance]
DISCORD_BOT_TOKEN=[A discord bot token (optional)]
```
Followed by running `npm run dev` in a terminal.

### Production server
This project is ready to be deployed to Vercel! Simply fork the repository and add it as a Vercel project.