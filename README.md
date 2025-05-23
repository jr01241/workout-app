# AI Strength Coach

An AI-powered strength training and hypertrophy workout application that provides personalized workout plans, exercise logging, and progress tracking through a chat-based interface.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **Charts:** Tremor
- **Database:** Vercel Postgres
- **ORM:** Prisma
- **AI Integration:** Vercel AI SDK
- **Font:** Geist Sans & Geist Mono

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
- `lib/` - Utility functions and shared code
- `prisma/` - Database schema and migrations
- `public/` - Static assets

## Deployment

The application is deployed using Vercel. To deploy:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Set the following environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your Vercel Postgres connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Deploy the application using the Vercel dashboard or CLI

## License

MIT
