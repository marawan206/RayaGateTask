# BookAPI Application for RayaGate

This repository contains a PHP Laravel API, a Nuxt.js Client, and MySQL database orchestrated using Docker Compose with an Nginx reverse proxy. 

## Prerequisites

Ensure that you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setting Up SSL Certificates

To create your own self-signed SSL certificates using OpenSSL, follow these steps:

1. Open a terminal and navigate to the `nginx/certs` directory:
   ```bash
   cd nginx/certs
   ```

2. Run the following command to generate a self-signed certificate:
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout selfsigned.key -out selfsigned.crt
   ```

3. You will be prompted to fill in information for the certificate. For local development, you can use `localhost` for the `Common Name (e.g. server FQDN or YOUR name)` prompt.

4. After this, the certificate files `selfsigned.crt` and `selfsigned.key` will be created in the `certs` directory.

## Project Structure

The important files are structured as follows:
- `docker-compose.yml`: Defines the services for the database, API, client, and Nginx.
- `Dockerfile` for API: Located in the `api/` directory.
- `Dockerfile` for Client: Located in the `client/` directory.
- `nginx/default.conf`: Nginx configuration file for reverse proxy and SSL.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/bookapi.git
   cd bookapi
   ```

2. **Build and run the containers**:
   From the root of the project directory, run the following command:
   ```bash
   docker-compose up --build or docker-compose up -d
   ```

   This will start all the services including the MySQL database, Laravel API, Nuxt.js client, and Nginx proxy.

3. **Access the application**:
   Once the containers are running, you can access the application at:
   - Client: `https://localhost` (Nginx will redirect from port 80 to 443 for SSL)
   - API: `https://localhost/api` (handled via Nginx proxy)

   **Note**: If you encounter SSL issues, ensure your browser trusts the self-signed certificate.

## Managing the Database

The application uses a MySQL database. You can connect to the MySQL database using the following credentials:
- **Host**: `localhost`
- **Port**: `3306`
- **Username**: `app`
- **Password**: `password`
- **Database**: `bookapi`

You can also check the `php artisan migrate` logs in the container to ensure database migrations are successful.

## Running Migrations

Database migrations are automatically run when the API container starts using the `run.sh` script.

If you need to manually run migrations inside the API container which you wont need since the run.sh but just in-case
```bash
docker-compose exec api php artisan migrate 
```

## Stopping the Application

To stop all running containers, use:
```bash
docker-compose down
```

This will stop and remove the containers but keep the database data intact.

## Docker Commands Cheatsheet

- **Build and Start containers**: 
  ```bash
  docker-compose up --build
  ```

- **Stop and remove containers**: 
  ```bash
  docker-compose down
  ```

- **View logs**:
  ```bash
  docker-compose logs -f
  ```

- **Access a running container (e.g., API)**:
  ```bash
  docker-compose exec api bash
  ```


```
# Challenge

## Overview

This repository contains a simple web application with two main components:

1. **API**: Written in Laravel PHP, the API serves as the backend for the application and listens on port 8000.
2. **Client**: Developed using Nuxt.js, the client is the frontend of the application and listens on port 3000.

### Environment Variables

- **API Directory**: Take a look at the `.env` file in the API directory. It should contain the necessary credentials to connect to the database.

    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=bookapi
    DB_USERNAME=app
    DB_PASSWORD=password


- **Client Directory**: Check the `.env` file in the Client directory. It should contain the connection string to connect to the API.

    VITE_API_URL=http://api:8000

```