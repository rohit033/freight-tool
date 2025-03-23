const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use Vercel's PORT env var or default to 3000
let requests = []; // In-memory store for requests

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Get all requests
app.get('/api/requests', (req, res) => {
    res.json(requests);
});

// Submit a new request
app.post('/api/requests', (req, res) => {
    const newRequest = {
        id: Date.now().toString(), // Simple unique ID
        ...req.body
    };
    requests.push(newRequest);
    res.status(201).send('Request submitted');
});

// Respond to a request
app.post('/api/requests/:id/respond', (req, res) => {
    const request = requests.find(r => r.id === req.params.id);
    if (request) {
        request.status = 'responded';
        request.response = req.body;
        res.send('Response submitted');
    } else {
        res.status(404).send('Request not found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});