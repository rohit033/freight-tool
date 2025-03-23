const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize data file if it doesn't exist
async function initializeData() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}

// Get all requests
app.get('/api/requests', async (req, res) => {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
});

// Submit a new request
app.post('/api/requests', async (req, res) => {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const requests = JSON.parse(data);
    const newRequest = {
        id: Date.now().toString(), // Simple unique ID
        ...req.body
    };
    requests.push(newRequest);
    await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2));
    res.status(201).send('Request submitted');
});

// Respond to a request
app.post('/api/requests/:id/respond', async (req, res) => {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const requests = JSON.parse(data);
    const request = requests.find(r => r.id === req.params.id);
    if (request) {
        request.status = 'responded';
        request.response = req.body;
        await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2));
        res.send('Response submitted');
    } else {
        res.status(404).send('Request not found');
    }
});

// Start server
async function startServer() {
    await initializeData();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();