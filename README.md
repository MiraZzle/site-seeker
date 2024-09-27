# ![alt text](_static/icon1.svg) SiteSeeker

This web application was made as a credit programme for the course NSWI153 (Advanced programming of web applications) at MFF CUNI.

## Prerequisites

If you want to run the development version of this programme, you will need:

## Usage

You need to use Docker to use the application.

```
git clone https://github.com/MiraZzle/webik-crawler.git
docker compose up
```

You can also use the .env file in the root of the project to specify the ports for both the backend and the frontend. There is a default one in the repo. You can provide your own values in that file:

```
BACKEND_PORT=3000
FRONTEND_PORT=8080
```

## Development

If you need to to run the project in development mode. Follow the steps below:

```
git clone https://github.com/MiraZzle/webik-crawler.git
```

#### Backend

1. Navigate to the backend folder of the project
2. Run this command:

```
node src/server.mjs
```

#### Frontend

1. Navigate to the frontend folder of the project
2. Run this command:

```
npm run dev
```

Open your browser of choice, type in http://localhost:5173 and enjoy!
