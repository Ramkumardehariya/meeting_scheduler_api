# Meeting Scheduler API

A RESTful API for managing meeting schedules with conflict detection and user management. Built with Node.js, Express, TypeScript, and MySQL using Sequelize ORM.

## Table of Contents

- [Setup & Installation](#setup--installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Migration & Run Commands](#migration--run-commands)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Module Design](#module-design)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Assumptions & Trade-offs](#assumptions--trade-offs)
- [Bonus Features](#bonus-features)

## Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meeting-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=meeting_scheduler
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
```

### Environment Variables Description

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `4000` |
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_PORT` | MySQL server port | `3306` |
| `DB_NAME` | Database name | `meeting_scheduler` |
| `DB_USER` | MySQL username | - |
| `DB_PASS` | MySQL password | - |

## Database Setup

### 1. Create Database

```sql
CREATE DATABASE meeting_scheduler CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Grant Permissions (optional)

```sql
GRANT ALL PRIVILEGES ON meeting_scheduler.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Database Schema

The application uses Sequelize ORM with auto-sync functionality. Tables will be created automatically when the server starts.

## Migration & Run Commands

### Development

```bash
# Start development server with hot reload
npm run dev
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with ts-node-dev |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server from compiled files |

## Architecture

The application follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────┐
│   Presentation  │  (Routes & Controllers)
├─────────────────┤
│    Business     │  (Services & Business Logic)
├─────────────────┤
│     Data        │  (Models & Database)
└─────────────────┘
```

### Key Architectural Patterns

- **MVC Pattern**: Models, Views (Controllers), and Routes separation
- **Dependency Injection**: Services injected into controllers
- **Repository Pattern**: Sequelize models act as repositories
- **Middleware Pattern**: Express middleware for cross-cutting concerns
- **DTO Pattern**: Data Transfer Objects for API contracts

## Folder Structure

```
meeting-service/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   └── database.ts           # Database connection setup
│   ├── middlewares/
│   │   └── error.middleware.ts   # Global error handling
│   ├── modules/
│   │   ├── meeting/              # Meeting module
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── create-meeting.dto.ts
│   │   │   │   └── update-meeting.dto.ts
│   │   │   ├── index/
│   │   │   │   └── meeting.controller.ts
│   │   │   ├── module/
│   │   │   │   └── meeting.model.ts
│   │   │   ├── routes/
│   │   │   │   └── meeting.routes.ts
│   │   │   └── service/
│   │   │       └── meeting.service.ts
│   │   └── user/                 # User module
│   │       ├── user.model.ts
│   │       └── user.routes.ts
│   └── utils/
│       └── constants.ts          # Application constants
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Module Design

### User Module

**Purpose**: Manage user entities and basic user operations.

**Components**:
- `user.model.ts`: Sequelize User model with validation
- `user.routes.ts`: Express routes for user CRUD operations

**Features**:
- Create users with unique email validation
- Retrieve users by ID
- Automatic timestamp management

### Meeting Module

**Purpose**: Comprehensive meeting management with conflict detection.

**Components**:
- `meeting.controller.ts`: HTTP request handlers
- `meeting.service.ts`: Business logic and conflict detection
- `meeting.model.ts`: Sequelize Meeting model
- `meeting.routes.ts`: Express route definitions
- `dto/`: Data transfer objects for API contracts

**Features**:
- CRUD operations for meetings
- Automatic conflict detection
- Time range validation
- User-based filtering
- Indexed queries for performance

## Database Design

### Tables

#### 1. users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User's unique email |
| `createdAt` | DATETIME | AUTO | Record creation timestamp |
| `updatedAt` | DATETIME | AUTO | Record update timestamp |

#### 2. meetings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique meeting identifier |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to users.id |
| `title` | VARCHAR(255) | NOT NULL | Meeting title |
| `startTime` | DATETIME | NOT NULL | Meeting start time |
| `endTime` | DATETIME | NOT NULL | Meeting end time |
| `createdAt` | DATETIME | AUTO | Record creation timestamp |
| `updatedAt` | DATETIME | AUTO | Record update timestamp |

### Relationships

- **One-to-Many**: One user can have multiple meetings
- **Foreign Key**: `meetings.userId` references `users.id`

### Indexes

```sql
-- Performance indexes for meetings table
CREATE INDEX idx_meetings_userId ON meetings(userId);
CREATE INDEX idx_meetings_startTime ON meetings(startTime);
CREATE INDEX idx_meetings_endTime ON meetings(endTime);
```

### Constraints & Validation

1. **Email Uniqueness**: Users must have unique email addresses
2. **Time Range Validation**: `startTime` must be before `endTime`
3. **Conflict Prevention**: No overlapping meetings for the same user
4. **Referential Integrity**: Meetings must reference valid users

### Design Reasoning

- **Denormalization**: Timestamps included for audit trails
- **Indexing Strategy**: Optimized for common query patterns (user-based, time-based)
- **Data Types**: DATETIME for precise time handling, VARCHAR for flexibility
- **Constraints**: Database-level validation for data integrity

## API Documentation

### Base URL

```
http://localhost:4000
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true|false,
  "message": "Human-readable message",
  "response": {}|[]  // Data payload (only on success)
}
```

### User Endpoints

#### Create User

```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "response": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get User by ID

```http
GET /users/1
```

**Response**:
```json
{
  "success": true,
  "message": "User found successfull",
  "response": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Meeting Endpoints

#### Create Meeting

```http
POST /meetings
Content-Type: application/json

{
  "userId": 1,
  "title": "Team Standup",
  "startTime": "2024-01-16T09:00:00.000Z",
  "endTime": "2024-01-16T09:30:00.000Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Meeting has been created successfully",
  "response": {
    "id": 1,
    "userId": 1,
    "title": "Team Standup",
    "startTime": "2024-01-16T09:00:00.000Z",
    "endTime": "2024-01-16T09:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### List Meetings

```http
GET /meetings?userId=1&start=2024-01-15T00:00:00.000Z&end=2024-01-20T23:59:59.000Z
```

**Query Parameters**:
- `userId` (optional): Filter by user ID
- `start` (optional): Start date filter (requires `end`)
- `end` (optional): End date filter (requires `start`)

**Response**:
```json
{
  "success": true,
  "message": "All meetings get successfully",
  "response": [
    {
      "id": 1,
      "userId": 1,
      "title": "Team Standup",
      "startTime": "2026-01-16T09:00:00.000Z",
      "endTime": "2026-01-16T09:30:00.000Z",
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Meeting by ID

```http
GET /meetings/1
```

**Response**:
```json
{
  "success": true,
  "message": "Meeting found successfully",
  "response": {
    "id": 1,
    "userId": 1,
    "title": "Team Standup",
    "startTime": "2026-01-16T09:00:00.000Z",
    "endTime": "2026-01-16T09:30:00.000Z",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

#### Update Meeting

```http
PUT /meetings/1
Content-Type: application/json

{
  "title": "Updated Team Standup",
  "startTime": "2026-01-16T10:00:00.000Z",
  "endTime": "2026-01-16T10:30:00.000Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Meeting updated successfully",
  "response": {
    "id": 1,
    "userId": 1,
    "title": "Updated Team Standup",
    "startTime": "2026-01-16T10:00:00.000Z",
    "endTime": "2026-01-16T10:30:00.000Z",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T11:00:00.000Z"
  }
}
```

#### Delete Meeting

```http
DELETE /meetings/1
```

**Response**:
```json
{
  "success": true,
  "message": "meeting deleted successfully"
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Time slot already booked"
}
```

#### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Assumptions & Trade-offs

### Assumptions

1. **Time Zone**: All timestamps are handled in UTC
2. **User Existence**: Meeting creation assumes referenced user exists
3. **Date Format**: ISO 8601 format for all date/time inputs
4. **Conflict Detection**: Only prevents exact time overlaps, not buffer times
5. **Authentication**: No authentication/authorization layer implemented
6. **Concurrent Access**: Assumes low concurrent access for conflict detection

### Trade-offs

1. **Simplicity vs Features**:
   - **Chose**: Simple REST API without authentication
   - **Reasoning**: Focus on core meeting scheduling functionality
   - **Impact**: Production would need security layer

2. **Auto-sync vs Migrations**:
   - **Chose**: Sequelize auto-sync for development ease
   - **Reasoning**: Rapid development and prototyping
   - **Impact**: Production should use proper migrations

3. **Error Handling**:
   - **Chose**: Simple error middleware
   - **Reasoning**: Adequate for current scope
   - **Impact**: Limited error context and logging

4. **Database Choice**:
   - **Chose**: MySQL with Sequelize
   - **Reasoning**: Mature, well-supported, good for relational data
   - **Impact**: Could consider PostgreSQL for additional features

5. **Validation Strategy**:
   - **Chose**: Basic validation in services
   - **Reasoning**: Simple and effective for current needs
   - **Impact**: Could benefit from validation library like Joi or Zod

## Bonus Features

### Implemented Features

1. **Conflict Detection Algorithm**: Prevents double-booking with sophisticated time overlap detection
2. **Flexible Filtering**: Query meetings by user and/or date ranges
3. **Automatic Timestamps**: Sequelize handles created/updated timestamps automatically
4. **Database Indexing**: Optimized queries for common access patterns
5. **TypeScript Safety**: Full type safety across the application
6. **Structured Error Handling**: Consistent error response format
7. **DTO Pattern**: Clear API contracts with TypeScript interfaces

### Potential Future Enhancements

1. **Authentication & Authorization**: JWT-based user authentication
2. **Recurring Meetings**: Support for daily, weekly, monthly recurring patterns
3. **Meeting Invitations**: Multi-user meetings with invitation system
4. **Time Zone Support**: Per-user time zone handling
5. **Calendar Integration**: Google Calendar/Outlook integration
6. **Notifications**: Email/SMS reminders for upcoming meetings
7. **Meeting Rooms**: Resource booking for physical/virtual rooms
8. **Advanced Conflict Resolution**: Suggest alternative time slots
9. **Bulk Operations**: Batch create/update meetings
10. **Analytics Dashboard**: Meeting statistics and usage patterns

### Performance Optimizations

1. **Database Indexes**: Strategic indexing for query performance
2. **Connection Pooling**: Sequelize manages database connections efficiently
3. **Lean Queries**: Selective field loading for API responses
4. **Caching Strategy**: Ready for Redis implementation

### Security Considerations

1. **Input Validation**: Basic validation prevents malformed data
2. **SQL Injection Prevention**: Sequelize ORM provides protection
3. **CORS Configuration**: Configurable cross-origin resource sharing
4. **Environment Variables**: Sensitive data stored securely

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.