# Project Setup

### Getting Started

This project contains 3 main parts, they are:

- `card` folder
- `card-react` folder
- optimized_query.sql

# A. Programming Test

**Run the project with docker-compose (recommended):**

- Run `docker-compose up -d` in the terminal.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser (react frontend).
- Backend is available to be tested on http default port 80 [http://localhost](http://localhost).
  - `GET` request
  - `POST` request with JSON body `{ "numberOfUser": <any_number> }`

**Run the project individually:**

1. To run the `card` project individually, please follow the step below:

- Change directory `cd` to the `card`.
- Install project dependencies with `npm ci`.
- Run the project locally in the terminal or command prompt, run the `card` script in `package.json` or simply execute `npm run card`.

2. To run the `card-react` project individually, please follow the step below:

- Change directory `cd` to the `card-react`.
- Install project dependencies with `npm ci`.
- Run the `start` script in `package.json` or simply execute `npm start`.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# B. SQL Improvement Logic Test

`optimized_query.sql` contains the explanations for SQL query improvements.

- Please note that proposed solutions in section 3 are tested & benchmarked in postgres environment.
- Please refer to section 4 for mysql. Unfortunately, this solution has not been tested.
