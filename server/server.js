const express = require('express');
const app = express();

app.get('/hey', (req, res) => res.send('ho!'))
app.get('/hey', (req, res) => res.send('ho!'))

app.listen(8080, () => {
    console.log("Listening on PORT 8080")
})