const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(__dirname + '/dist/task'))
app.listen(process.env.PORT || '3000');

//PathLocationStrategy

app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname + '/dist/task/index.html'));
})

console.log('server listening on port 3000')
