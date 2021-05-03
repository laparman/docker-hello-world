
const express = require('express')
const app = express()
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World 2!')
})

app.get('/version', (req, res) => {
  res.send(process.env.VERSION || 'No version')
})

app.get('/hang', (req, res) => {
  var startDate = new Date();
  for(i=0;i<100000000;i++){
    var endDate  = new Date();
    var dur = (endDate.getTime() - startDate.getTime()) / 1000;
    if(dur > 100000 ) break;
  }
  res.send("30 sec wait done");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
