# EdTech Backend API

A comprehensive backend API for an educational technology platform built with Node.js, TypeScript, TypeORM, PostgreSQL, and Redis.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your database credentials
# (See Environment Configuration section below)

# 3. Run database migrations
npm run migration:run

# 4. Start the server
npm start

# 5. Access API documentation
# http://localhost:8000/api/api-docs/
```

## 🛠️ Prerequisites

- **Node.js** v20 or higher
- **PostgreSQL** v17.6 or higher
- **Redis** v6.0 or higher
- **npm** or **yarn** package manager

## 📋 System Requirements

### PostgreSQL Setup
1. Download PostgreSQL v17.6 from [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
2. Install with default settings (port: 5432)
3. Create a database user `postgres` with a secure password
4. Create a new database named `edtechDB`
5. Enable UUID extension by running in PostgreSQL query tool:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

### Redis Setup
1. Download Redis from [Microsoft Archive](https://github.com/microsoftarchive/redis/releases)
2. Extract and run `redis-server.exe` from the server folder
3. Or run from command prompt: `redis-server`
4. Redis will run on default port 6379

## 🚀 Installation & Configuration

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend root directory:
```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=edtechDB

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_ACCESS_TOKEN_PRIVATE_KEY=your_jwt_private_key_here
JWT_ACCESS_TOKEN_PUBLIC_KEY=your_jwt_public_key_here
JWT_REFRESH_TOKEN_PRIVATE_KEY=your_refresh_token_private_key_here
JWT_REFRESH_TOKEN_PUBLIC_KEY=your_refresh_token_public_key_here

# Server Configuration
PORT=8000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Database Configuration
The database configuration is automatically handled through environment variables. The system supports both `config` package and direct environment variable access for maximum compatibility.

## 🗄️ Database Migrations

### Migration Files Structure
The project uses TypeORM migrations to manage database schema changes:

```
src/migrations/
├── CreateEdTechDB1690000000009.ts          # Initial database setup
├── AddInstituteAdminRoleAndForeignKey1700000000000.ts  # Institute functionality
└── 1758889000000-UpdateDatabaseSchema.ts   # Latest comprehensive changes
```

### Running Migrations

#### First Time Setup
For initial database setup, run the migration command:
```bash
npm run migration:run
```

#### Migration Commands (Recommended)
The project includes convenient NPM scripts for migration management:

```bash
# Run all pending migrations
npm run migration:run

# Generate a new migration from entity changes
npm run migration:generate src/migrations/YourMigrationName

# Create an empty migration file
npm run migration:create src/migrations/YourMigrationName

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

#### Migration Status
**Current Status**: TypeORM CLI has compatibility issues with version 0.3.6. The recommended approach is to use the custom migration script.

**Working Methods**:
```bash
# Recommended: Use custom migration script
npm run migration:run

# Alternative: Direct script execution
npx ts-node run-migrations.ts
```

**Note**: TypeORM CLI commands may not work due to version compatibility issues. The custom migration script provides reliable migration management.

### Migration History
- **CreateEdTechDB1690000000009.ts**: Initial database schema with all core tables
- **AddInstituteAdminRoleAndForeignKey1700000000000.ts**: Adds institute admin role and foreign key relationships
- **1758889000000-UpdateDatabaseSchema.ts**: Latest updates including nullable teacher_id, institute-based filtering, and additional tables

## 🏃‍♂️ Running the Application

### Available NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Start Development** | `npm start` | Start the development server with hot reload |
| **Run Migrations** | `npm run migration:run` | Run all pending database migrations |
| **Generate Migration** | `npm run migration:generate` | Generate migration from entity changes |
| **Create Migration** | `npm run migration:create` | Create empty migration file |
| **Revert Migration** | `npm run migration:revert` | Revert the last migration |
| **Show Migrations** | `npm run migration:show` | Show migration status |
| **TypeORM CLI** | `npm run typeorm` | Access TypeORM CLI directly |

### Development Mode
```bash
npm start
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:8000`

## 📚 API Documentation

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:8000/api/api-docs/
```

### Authentication
All endpoints (except login) require authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🔗 API Endpoints

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | User login (returns JWT token) |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/users/me` | Get current user profile |

### Institutes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/institutes` | Get all institutes (Admin only) |
| POST | `/api/v1/institutes` | Create new institute (Admin only) |
| GET | `/api/v1/institutes/:instituteId` | Get institute by ID |
| PATCH | `/api/v1/institutes/:instituteId` | Update institute |
| DELETE | `/api/v1/institutes/:instituteId` | Delete institute |

### Teachers
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/teachers` | Get all teachers (Institute-scoped) |
| POST | `/api/v1/teachers` | Create new teacher |
| GET | `/api/v1/teachers/:teacherId` | Get teacher by ID |
| PATCH | `/api/v1/teachers/:teacherId` | Update teacher |
| DELETE | `/api/v1/teachers/:teacherId` | Delete teacher |

### Students
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/students` | Get all students (Institute-scoped) |
| POST | `/api/v1/students` | Create new student |
| GET | `/api/v1/students/:studentId` | Get student by ID |
| PATCH | `/api/v1/students/:studentId` | Update student |
| DELETE | `/api/v1/students/:studentId` | Delete student |

### Courses
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/courses` | Get all courses (Institute-scoped) |
| POST | `/api/v1/courses` | Create new course |
| GET | `/api/v1/courses/:courseId` | Get course by ID |
| PATCH | `/api/v1/courses/:courseId` | Update course |
| DELETE | `/api/v1/courses/:courseId` | Delete course |

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/          # API route handlers
│   ├── entities/            # TypeORM database entities
│   ├── middleware/          # Custom middleware functions
│   ├── migrations/          # Database migration files
│   ├── routes/              # API route definitions
│   ├── schemas/             # Zod validation schemas
│   ├── services/            # Business logic layer
│   ├── swagger/             # OpenAPI documentation
│   └── utils/               # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 User Roles & Permissions

- **Admin**: Full system access, can manage institutes
- **Institute Admin**: Manages their institute's teachers, students, and courses
- **Teacher**: Manages their assigned courses and lessons
- **Student**: Accesses their enrolled courses and materials

## 🧪 Testing

### Create Test User
After running migrations, create a test admin user:
```sql
INSERT INTO public."user"(
    user_id, user_name, password, role, status, "verificationCode", email, verified, created_at, updated_at
) VALUES (
    '1404c896-8cb5-44d0-910a-391739d7a4a7', 
    'admin',
    '$2a$12$cUMBmMPHMl8CbV0N4kUyrexgtIg5ijPZXR8BbR9mkXj.YuIZ4d4G.', 
    'admin', 
    'active', 
    '123', 
    'admin@edtech.com', 
    true, 
    NOW(),
    NOW()
);
```
**Note**: Password is `12345678` (encrypted in the script)

### API Testing
Use the Swagger UI at `http://localhost:8000/api/api-docs/` to test endpoints interactively.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure `edtechDB` database exists
   - Verify environment variable names match the `.env` file

2. **Redis Connection Error**
   - Verify Redis server is running
   - Check Redis URL in `.env`

3. **Migration Errors**
   - Ensure database has `uuid-ossp` extension
   - Check migration file syntax
   - Verify database permissions
   - Use `npm run migration:run` instead of direct TypeORM CLI commands
   - If TypeORM CLI fails, use `npx ts-node run-migrations.ts`

4. **JWT Token Issues**
   - Verify JWT keys are set in `.env`
   - Check token expiration time
   - Ensure proper Authorization header format

5. **TypeORM CLI Issues**
   - Use NPM scripts instead: `npm run migration:run`
   - If CLI is needed, use migration data source: `npx typeorm migration:run -d src/utils/migration-data-source.ts`
   - Ensure `.env` file exists with correct variable names

### Logs
Check application logs for detailed error information:
```bash
npm run dev  # Shows detailed logs in development
```

## 📝 Development Notes

- The system uses **institute-based data isolation** - each institute only sees their own data
- **OpenAPI validation** is enabled for request/response validation
- **Password hashing** is handled automatically via TypeORM hooks
- **UUID generation** is used for all primary keys
- **Soft deletes** are implemented for data integrity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.