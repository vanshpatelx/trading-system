// services/trader-service/index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Trader Service Running'));

app.listen(3000, () => console.log('Trader Service listening on port 3000'));
