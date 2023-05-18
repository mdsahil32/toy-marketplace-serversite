const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const category = require('./CategoryData/Data.json')

// middleWare 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hero toys server is running')
})

app.get('/category', (req, res) => {
    res.send(category)
})

app.get('/toys/:id', (req, res) => {
    const id = req.params.id;
    const selectedToys = category.find(c => c.number ==  id)
    res.send(selectedToys)
})

app.get('/category/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const actionHero = category.filter(c => c.id == id)
    res.send(actionHero)
})



app.listen(port, () => {
    console.log(`running on port ${port}`);
})