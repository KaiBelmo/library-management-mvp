# Library Management MVP – Backend

This repository contains the backend for the **Library Management MVP**, built using Directus as the headless CMS and PostgreSQL as the database. The application is containerized using Docker for easy setup and deployment.


## Tech Stack

- **Directus** – Headless CMS & API layer
- **PostgreSQL 15** – Relational database
- **Docker & Docker Compose** – Local development and orchestration
- **directus-extension-sync + directus-sync** – Configuration and schema synchronization

## Project Structure

```
backend/
├── .env.example           # Example environment variables
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Custom Directus Docker image
├── directus-config/       # Directus configuration files
│   ├── collections/       # Collection definitions
│   ├── snapshot/          # Database snapshots
│   └── specs/             # API specifications
├── directus-sync.config.cjs  # Directus sync configuration
└── testing/               # Backend tests
    ├── api/               # API test files
    ├── config/            # Test configurations
    ├── setup/             # Test setup files
    └── ...               # Other test files
```

## Docker Compose Configuration

The `docker-compose.yml` file defines and manages three main services:

### 1. Database Service (`db`)
- **Image**: `postgres:15`
- **Purpose**: Hosts the PostgreSQL database
- **Features**:
  - Persistent storage using Docker volume `db_data`
  - Automatic restart policy (`unless-stopped`)
  - Health check to verify database readiness
  - Environment variables loaded from `.env` file

### 2. Directus Service (`directus`)
- **Base Image**: Custom build from `Dockerfile` (based on `directus/directus:latest`)
- **Purpose**: Runs the Directus headless CMS
- **Features**:
  - Depends on the `db` service being healthy
  - Port mapping from host to container (configurable via `HOST_PORT` and `CONTAINER_PORT`)
  - Health check to verify Directus API availability
  - Environment variables loaded from `.env`

### 3. Directus Sync Service (`directus-sync`)
- **Image**: `node:22-alpine`
- **Purpose**: Manages Directus configuration synchronization
- **Features**:
  - Runs after Directus is healthy
  - Mounts local `directus-config` directory
  - Uses `directus-sync` to push configurations
  - Runs once and exits (doesn't restart)

### Volumes
- `db_data`: Persistent volume for PostgreSQL data storage


## Data Model

### Books

| Field | Type | Notes |
|-----|-----|-----|
| id | UUID | Primary key |
| title | varchar(200) | Book title (max 200 chars) |
| author | varchar(100) | Author name (max 100 chars) |
| genre | varchar(50) | Book genre (max 50 chars) |
| publication_date | timestamp | Publication date |
| cover_photo | UUID | Foreign key to Directus files|
| allow_comments | boolean | Enable/disable comments |
| user_created | UUID | Auto-managed by by Directus |
| user_updated | UUID | Auto-managed by by Directus |
| date_created | timestamptz | Auto-managed by Directus |
| date_updated | timestamptz | Auto-managed by Directus |

A book can have **many comments**.

### Comments

| Field | Type | Notes |
|-----|-----|-----|
| id | UUID | Primary key |
| content | text | Comment text |
| author_name | varchar | Display name |
| book_id | UUID | FK → books (cascade delete) |
| user_created | UUID | Created by Directus |
| date_created | timestamptz | Auto-managed by Directus |

### Users

| Field | Type | Notes |
|-----|-----|-----|
| id | UUID | Primary key |
| first_name | varchar | User first name |
| last_name | varchar | User last name |
| email | varchar | Unique email address |
| password | varchar | Hashed password |
| role | varchar | User role (admin/user) |
| date_created | timestamptz | Auto-managed by Directus |


## Access Control & Permissions

### Default User Role

Newly registered users are automatically assigned a **default role**. 
This role uses the **User Access Control Policy**.

#### Books Permissions

- **Create**: Allowed
- **Read**: Allowed
- **Update / Delete**: Only if the user created the record

Condition:
```json
{
  "_and": [
    { "user_created": { "_eq": "$CURRENT_USER" } }
  ]
}
```
#### Comments Permissions

- Create: Allowed
- Read: Allowed
- Delete: Only if the user created the record
- Update: Not allowed
- Condition:
```json
{
  "_and": [
    { "user_created": { "_eq": "$CURRENT_USER" } }
  ]
}
```
### Public Policy
The Public Policy allows unauthenticated users to:
- Partially read books
- Partially read comments
Write operations are not permitted for public users.

## Environment Variables
Environment variables are defined in the .env file at the backend root.
A .env.example file is provided as a reference.

- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `KEY`: Application key
- `SECRET`: Application secret
- `ADMIN_EMAIL`: Admin user email
- `ADMIN_PASSWORD`: Admin user password
- `HOST_PORT`: Port exposed on the host
- `CONTAINER_PORT`: Port exposed in the container
- `DIRECTUS_URL`: Directus instance URL
- `DUMP_PATH`: Path for Directus sync dumps

### Building and Running the Application

1. **Build the Docker containers**:
   ```bash
   docker compose build
   ```

2. **Start the services in detached mode**:
   ```bash
   docker compose up -d
   ```

3. **To stop the services**:
   ```bash
   docker compose down
   ```
   
## Testing

For detailed information about running tests, please refer to the [Testing Guide](./testing/README.md).

## Database Seeding

For populating the database with test data, please refer to [Seed Documentation](./seed/README.md).
