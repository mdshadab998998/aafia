const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// For getting the device, OS, and browser details
const useragent = require('express-useragent');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(useragent.express());

// Connect to MongoDB Atlas
const mongoURI = 'mongodb+srv://mdshadabkhan4256:wSJx3Io1TiCSfnt3@cluster0.gf9qz.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Define a schema and model for saving user details
const userSchema = new mongoose.Schema({
    browser: String,
    device: String,
    os: String,
    time: { type: Date, default: Date.now },
    istTime: String // IST time
});

const User = mongoose.model('User', userSchema);

// Helper function to get the exact current IST
function getCurrentIST() {
    return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date());
}

// API route to save user details
app.post('/api/save-details', (req, res) => {
    const istTime = getCurrentIST();
    
    const userDetails = new User({
        browser: req.useragent.browser,
        device: req.useragent.platform,
        os: req.useragent.os,
        istTime: istTime
    });

    userDetails.save()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json({ error: 'Unable to save data' }));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
