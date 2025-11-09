# Deimos Backend API

Backend API for the Deimos zkVM Mobile Benchmarking Suite. Built with Node.js, Express, and Firebase Firestore.

## 📁 Project Structure

```
backend/
├── config/
│   ├── firebase.js          # Firebase Admin SDK initialization
│   └── constants.js         # Application constants and configuration
├── controllers/
│   └── benchmarkController.js  # Business logic for benchmark operations
├── middleware/
│   ├── cors.js              # CORS configuration
│   └── errorHandler.js      # Global error handling
├── routes/
│   ├── index.js             # Main router
│   └── benchmarkRoutes.js   # Benchmark API routes
├── scripts/
│   ├── seed.js              # Database seeding script
│   └── fetchData.js         # Data export script
├── utils/
│   └── logger.js            # Logging utility
├── .env                     # Environment variables (not in git)
├── server.js                # Application entry point
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the backend directory with your Firebase credentials:
   ```env
   FIREBASE_ADMINSDK_CREDENTIALS={"type":"service_account","project_id":"your-project-id",...}
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=*
   ```

3. **Enable Firestore API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Cloud Firestore API for your project
   - Create a Firestore database (production or test mode)

### Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Operations

### Seed Database

Populate Firestore with benchmark data from `website/src/app/benchmark.ts`:

```bash
npm run seed
```

This will:
- Delete all existing benchmark documents
- Add all benchmark entries from the source file
- Display progress and completion status

### Fetch All Data

Export all Firestore data to `firebasedata.js`:

```bash
npm run fetch-data
```

This creates a JavaScript file with all benchmark data for backup or analysis.

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Deimos Backend API is running"
}
```

### Get Benchmarks (Filtered & Paginated)
```http
GET /api/benchmarks?circuit=all&framework=all&language=all&platform=all&page=1&limit=10
```

**Query Parameters:**
| Parameter  | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| circuit   | string | all     | Filter by circuit type         |
| framework | string | all     | Filter by framework            |
| language  | string | all     | Filter by language             |
| platform  | string | all     | Filter by platform             |
| page      | number | 1       | Page number                    |
| limit     | number | 10      | Items per page                 |

**Response:**
```json
{
  "data": [
    {
      "id": "doc-id",
      "circuit": "SHA-256",
      "framework": "MoPro",
      "language": "Circom",
      "platform": "Android",
      "device": "Samsung Galaxy S21",
      "provingTime": 2.45,
      "verificationTime": 0.12,
      "createdAt": "2024-11-09T08:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalCount": 32,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Filter Options
```http
GET /api/filters
```

**Response:**
```json
{
  "circuits": ["all", "BLAKE2s-256", "Keccak-256", "MiMC", "MiMC-256", "Pedersen", "Poseidon", "SHA-256"],
  "frameworks": ["all", "MoPro"],
  "languages": ["all", "Circom", "Noir"],
  "platforms": ["all", "Android", "iOS"]
}
```

## 🏗️ Architecture

### MVC Pattern

- **Models**: Firebase Firestore collections
- **Views**: JSON responses
- **Controllers**: Business logic in `controllers/`
- **Routes**: API endpoints in `routes/`

### Middleware Stack

1. **CORS**: Cross-origin resource sharing
2. **Body Parser**: JSON and URL-encoded data
3. **Request Logger**: Logs all incoming requests
4. **Routes**: API endpoint handlers
5. **404 Handler**: Not found responses
6. **Error Handler**: Global error handling

### Error Handling

All errors are caught and returned in a consistent format:

```json
{
  "error": "Error message here"
}
```

In development mode, stack traces are included.

## 🔧 Configuration

### Environment Variables

| Variable                        | Description                      | Default       |
|--------------------------------|----------------------------------|---------------|
| FIREBASE_ADMINSDK_CREDENTIALS  | Firebase Admin SDK JSON          | Required      |
| PORT                           | Server port                      | 5000          |
| NODE_ENV                       | Environment (dev/production)     | development   |
| CORS_ORIGIN                    | Allowed CORS origins             | *             |

### Firebase Collection

- **Collection Name**: `benchmarks`
- **Document Structure**:
  ```javascript
  {
    circuit: string,
    framework: string,
    language: string,
    platform: string,
    device: string,
    provingTime: number,
    verificationTime: number,
    createdAt: string (ISO 8601)
  }
  ```

## 🧪 Testing

Test the API using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all benchmarks (first page)
curl http://localhost:5000/api/benchmarks

# Get filtered benchmarks
curl "http://localhost:5000/api/benchmarks?circuit=SHA-256&platform=Android&limit=5"

# Get filter options
curl http://localhost:5000/api/filters
```

## 📝 Logging

The application uses a custom logger with timestamps:

- `logger.info()` - General information
- `logger.error()` - Error messages
- `logger.warn()` - Warnings
- `logger.debug()` - Debug info (development only)

## 🚨 Common Issues

### Firestore API Not Enabled

**Error**: `Cloud Firestore API has not been used in project...`

**Solution**: 
1. Visit the activation URL in the error message
2. Click "Enable API"
3. Wait 2-3 minutes for propagation
4. Restart the server

### Environment Variables Not Loading

**Error**: `FIREBASE_ADMINSDK_CREDENTIALS environment variable is not set`

**Solution**:
- Ensure `.env` file exists in the backend directory
- Check that the credentials JSON is properly formatted (single line)
- Verify the file is not in `.gitignore`

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
- Change PORT in `.env` file
- Or kill the process using port 5000:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use environment-specific CORS origins in production
- Implement rate limiting for production deployments
- Add authentication/authorization as needed
- Validate and sanitize all user inputs

## 📚 Dependencies

- **express**: Web framework
- **firebase-admin**: Firebase Admin SDK
- **cors**: CORS middleware
- **dotenv**: Environment variable management

## 🤝 Contributing

When adding new features:

1. Create controllers in `controllers/`
2. Define routes in `routes/`
3. Add middleware in `middleware/` if needed
4. Update constants in `config/constants.js`
5. Use the logger utility for all logging
6. Follow existing code structure and patterns

## 📄 License

MIT
