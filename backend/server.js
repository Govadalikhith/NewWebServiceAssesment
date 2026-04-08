const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupDatabase } = require('./db/database');
const apiRoutes = require('./routes/api');

dotenv.config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function startServer() {
    try {
        const db = await setupDatabase();
        console.log('Connected to SQLite database');

        app.use('/api', apiRoutes(db));

        // Serve static files from the frontend
        const frontendPath = path.join(__dirname, '../frontend/dist');
        app.use(express.static(frontendPath));

        // Fallback for SPA (React)
        app.get('*', (req, res) => {
            if (!req.path.startsWith('/api')) {
                res.sendFile(path.join(frontendPath, 'index.html'));
            }
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
