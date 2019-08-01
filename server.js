const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(__dirname + '/dist'))
let port = process.env.port || 3000;
app.listen(port);

//PathLocationStrategy

app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname + '/dist/index.html'));
})

console.log('server listening on port 3000')
