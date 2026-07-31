# Jed Consultancy Web Platform

This repository contains the source code for the **Jed Consultancy** website and its headless CMS backend. It is a modern, responsive web application built to showcase professional courses, visa services, client testimonials, and manage customer enquiries.

The project is structured into two main parts:
1. **Frontend (`/Jed`)**: A high-performance web application built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.
2. **Backend CMS (`/JedStudio`)**: A headless content management system built with Sanity v3.

## System Requirements

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **Package Manager**: npm (v9+), yarn, pnpm, or bun
- **Git**: For version control

---

## Installation & Setup Guide

### 1. Clone the Repository

```bash
git clone "link here"
cd "project folder name"
```

### 2. Setup the CMS Backend (Sanity Studio)

The CMS handles all the dynamic data like courses, testimonials, visa services, banners, FAQs, and stores customer enquiries.

```bash
# Navigate to the studio directory
cd "studio folder name"

# Install dependencies
npm install

# Start the development server
npm run dev
```
The Sanity Studio will now be running at `http://localhost:3333`. You can log in using your authorized Sanity credentials.

### 3. Setup the Frontend (Next.js)

Open a new terminal window/tab to set up the frontend application.

```bash
# Navigate back to the frontend directory
cd Jed

# Install dependencies
npm install
```

### 4. Configure Environment Variables

The frontend application requires specific environment variables to connect to Sanity and handle API requests securely.

1. Inside the `/Jed` directory, copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and populate the values:
   - `SANITY_PROJECT_ID`: Already set (e.g., `62ycsw5tt`).
   - `SANITY_DATASET`: Already set to `production`.
   - `SANITY_API_TOKEN`: You must generate a write-enabled API token in your Sanity project settings (Manage -> API -> Tokens). This is required for submitting contact forms.
   - `ADMIN_EXPORT_KEY`: A secure, secret string of your choosing. It is used to secure the CSV export API route.
   - `NEXT_PUBLIC_STUDIO_ORIGIN`: URL of your deployed Sanity Studio (to configure CORS for CSV export). Use `http://localhost:3333` for local development.
   - `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `http://localhost:3000` for dev), used for generating `sitemap.xml` and `robots.txt`.

### 5. Run the Frontend Development Server

Once your environment variables are configured:

```bash
# From inside the /Jed directory
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). 
Any edits to the code will hot-reload the page automatically.

---

## Available Scripts

### Frontend (`/Jed`)
- `npm run dev`: Starts the Next.js development server on port 3000.
- `npm run build`: Compiles the application for production, generating static pages and optimizing assets.
- `npm run start`: Starts the Next.js production server (must run `npm run build` first).
- `npm run lint`: Runs ESLint to catch formatting and code quality issues.

### Backend CMS (`/JedStudio`)
- `npm run dev`: Starts the Sanity Studio on port 3333.
- `npm run build`: Builds the Sanity Studio for deployment.
- `npm run start`: Runs a local server to preview the built Studio.

---

## Technologies Used

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI/Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Remix Icon](https://remixicon.com/)
- **Smooth Scrolling**: [Lenis](https://lenis.studiofreight.com/)
- **Data Fetching**: GROQ & Sanity Client

### Backend / CMS
- **Platform**: [Sanity.io](https://sanity.io/) (v3)
- **Features**: Custom schema definitions, custom Plugins (Enquiry Exporter)

---

## Deployment

### Frontend (Vercel)
The easiest way to deploy the Next.js frontend is via [Vercel](https://vercel.com).
1. Connect your GitHub repository to Vercel.
2. In the Vercel project settings, configure the Root Directory to `Jed`.
3. Add all the environment variables from `.env.local` to Vercel's Environment Variables section.
4. Deploy.

### Backend (Sanity)
Deploying the Sanity Studio is done via the Sanity CLI:
```bash
cd JedStudio
npx sanity deploy
```
*Note: Make sure your deployed frontend URL is added to the Sanity project's CORS origins in `manage.sanity.io`.*
