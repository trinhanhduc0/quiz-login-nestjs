# login-service

The **login-service** is a NestJS backend application responsible for user authentication and user management.

## Features

- **Authentication**: Uses Firebase Admin SDK to verify Firebase ID tokens and issues JWTs for authenticated sessions.
- **User Management**: Create and retrieve user information stored in MongoDB.
- **JWT Handling**: Creates and validates JWT tokens with configurable expiration.

## Modules

- **AuthModule**: Handles authentication logic including Firebase token verification and JWT management.
- **UserModule**: Manages user data persistence and retrieval.

## Setup

### Prerequisites

- Node.js and npm installed
- MongoDB instance running and accessible
- Firebase service account JSON file (`firebase-config.json`) placed in the root of the service directory

### Installation

1. Navigate to the `login-service` directory:

```bash
cd login-service
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables, especially:

- `MONGODB_URI` for MongoDB connection
- `JWT_SECRET` for signing JWT tokens (optional, defaults to 'defaultSecret')

### Running the Service

Run the service in development mode:

```bash
npm run start:dev
```

### Testing

Run tests using:

```bash
npm run test
```

## Technologies Used

- [NestJS](https://nestjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- TypeScript

## License

This project is licensed under the MIT License.
