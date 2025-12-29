# Library Management MVP - Seed Script

This script populates the Directus CMS with test data for the Library Management MVP project.

## Features

- Creates multiple test users with random profiles
- Generates books with random titles, authors, and genres
- Adds cover photos from a random image service
- Includes optional comments for books

## Prerequisites

- Node.js 16+ installed
- Directus instance running and accessible
- Environment variables configured (see `.env.example`)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   DIRECTUS_URL=http://localhost:8055
   ```
   Adjust the URL to match your Directus instance.

## Usage

Run the seed script:

```bash
node seed.js
```

## What It Does

1. Creates 20 test users with random profiles
2. For each user:
   - Creates 2-4 books with random data
   - Uploads random cover images
   - Optionally adds 1-3 comments per book
3. Shows progress in the console

## Notes

- The script includes a 1-second delay between API calls to prevent rate limiting
- If you encounter rate limiting, you may need to disable the rate limiter in your Directus configuration
- Test user passwords are set to 'Password123!'
- Book cover images are fetched from picsum.photos

## Customization

You can modify the following constants in `seed.js`:
- `TOTAL_USERS`: Number of test users to create
- Book count per user (currently 2-4)
- Comment count per book (currently 1-3)