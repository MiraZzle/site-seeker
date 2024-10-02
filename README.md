<img src="_static/title.svg" alt="alt text" width="300" height="auto" style="margin-bottom: 16px;">

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

SiteSeeker is a minimalist web crawler designed for constructing detailed website graphs and extracting link information. The app supports parallel web scraping to ensure efficient and scalable data extraction.

---

## Prerequisites

To run the application, you will need Docker installed.

You can specify custom environment variables in the .env file located at the root of the project. By default, the following ports are used:

```bash
BACKEND_PORT=3000
FRONTEND_PORT=8080
```

You can modify these values to suit your needs.

## Usage

To clone and run the project using Docker, follow these steps:

```
git clone https://github.com/MiraZzle/webik-crawler.git
docker compose up --build
```

After building the containers, you can use the following command to run them:

```bash
docker compose up
```

This will start both the backend and frontend of the application.

## Development

If you need to to run the project in development mode. Follow the steps below:

```
git clone https://github.com/MiraZzle/webik-crawler.git
```

#### Backend

1. Navigate to the backend folder:

```bash
cd backend
```

2. Start the backend server:

```bash
node src/server.mjs
```

#### Frontend

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Start the development server:

```
npm run dev
```

Once the application is running, visit http://localhost followed by the port number you specified in the .env file (e.g., http://localhost:3000 for the backend or http://localhost:8080 for the frontend) to access the respective services.

## Documentation and Wiki

For detailed information about the project's architecture, features, and usage examples, please visit our [GitHub Wiki](https://github.com/MiraZzle/site-seeker/wiki).
