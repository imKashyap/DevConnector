const express = require('express');
const connectDB=require('./config/db');

const app =express();
const PORT= process.env.PORT || 5000;

// Connecting to MongoDB
connectDB();

// Enabling bodyParser
app.use(express.json({extended: false}));

// Routing to different routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

// Starting the server
app.get('/', (req, res) =>res.send('API Running'));
app.listen(PORT, ()=>console.log('listening on http://localhost:'+PORT));