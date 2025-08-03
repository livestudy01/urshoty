require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const publicRoutes = require('./routes/public');
const apiRoutes = require('./routes/api');

// --- STARTUP CHECKS ---
const requiredEnvVars = [
    'FRONTEND_URL',
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY',
    'MYSQL_HOST',
    'MYSQL_USER',
    'MYSQL_DATABASE',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}


const app = express();

// --- MIDDLEWARE SETUP ---
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
    res.send('SwiftLink Backend is running!');
});

// Public routes (redirector)
app.use('/', publicRoutes);

// Protected API routes
app.use('/api', apiRoutes);

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});
