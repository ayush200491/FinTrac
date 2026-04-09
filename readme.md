# ExpenseWise

ExpenseWise is a full-stack expense tracking application.
It combines a Spring Boot backend with a React frontend to manage users, budgets, expenses, and dashboard analytics.

## Tech Stack

### Frontend
- React 18
- Webpack 5
- Styled Components
- React Router
- React Hook Form
- Recharts
- Axios

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL 8
- Maven

### Infrastructure
- Docker
- Docker Compose
- Nginx (for frontend static hosting in container)

## Features

- Authentication and protected routes
- Role-based access patterns
- Expense tracking and management
- Budget-related UI modules
- Dashboard with charts and summary cards
- Reusable UI components and custom hooks
- Global error handling and form validation

## Project Structure

```text
ExpenseWise/
  backend/          Spring Boot API
  frontend/         React app (Webpack)
  docker-compose.yml
  readme.md
```

## Quick Start (Docker Recommended)

### Prerequisites

- Docker
- Docker Compose

### Run

From the project root:

```bash
docker compose up --build
```

From any directory, you can run with an explicit compose file path:

```bash
docker compose -f /Users/ayushpatidar/Desktop/ETT/ExpenseWise/docker-compose.yml up --build
```

If your environment uses the legacy command, use:

```bash
docker-compose up --build
```

### Services

- Frontend: http://localhost:9000
- Backend API: http://localhost:8080
- MySQL: localhost:3307 (mapped to container 3306)

### Stop

```bash
docker compose down
```

## Local Development (Without Full Docker Stack)

You can run backend and frontend locally, and optionally run MySQL with Docker.

### 1. Start MySQL

```bash
docker compose up -d mysql
```

### 2. Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend defaults to port `8080`.

### 3. Run Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

Frontend dev server runs on port `9000`.

## Configuration

Backend database properties are defined in `backend/src/main/resources/application.properties` and support environment variable overrides:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Default Docker Compose database values:

- Database: `expenses`
- Username: `root`
- Password: `mysqls01)`

## Useful Commands

```bash
# Rebuild and start all services
docker compose up --build

# View logs
docker compose logs -f

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes (deletes DB data)
docker compose down -v
```

## Troubleshooting

- If backend fails to connect to MySQL, wait for MySQL health check to pass and retry.
- If port conflicts occur, free ports `9000`, `8080`, or `3307`.
- If frontend cannot call backend in local mode, ensure backend is running on `http://localhost:8080`.

## License

This project is licensed under the MIT License. See `LICENSE` for details.