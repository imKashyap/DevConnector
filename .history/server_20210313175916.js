import express from 'express';
const app =express();
const PORT= process.env.PORT || 5000;
app.get('/', (req, res) =>res.send('API Running'));
app.listen(PORT, ()=>console.log('listening on http//localhost:${PORT}'));