const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const category = require('./CategoryData/Data.json')

// middleWare 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('hero toys server is running')
})

app.get('/category', (req, res) =>{
    res.send(category)
})

app.listen(port, () =>{
    console.log(`running on port ${port}`);
})