const express = require('express');
const {getFolderWithDate,getFoldersList,getDownloadLink} = require('./googledrive/googleDriveClient.js');
const port = process.env.PORT || 3000;
const app = express();

app.get('/',(req,res)=>{
    res.send('hello');
});

/** '/listfolders' route
 *  Lists folders in DOH COVID-19 Data Drop 
 *  query parameters:
 *      [date] : specifies the folder date (data drops are created daily)
 *               format is YYYYMMDD.
 *               example usage: '/listfolders?date=20200420'
 *      [empty query]: lists all folders under root DOH data drop drive folder
 *  Returns a JSON object with parameters "id" (folder id) and "name"
 *      ex. 
 *          [{
 *                  "id": "1zgEKsGhx-5VIz3lHdThWcSDlmo3NI7Gr",
 *                  "name": "DOH COVID Data Drop_ 20200420"
 *          }]
**/
app.get('/listfolders',(req,res)=>{
    const date = req.query.date; //YYYYMMDD
    if(!date){
        return getFoldersList((error,data)=>{
            if (error) return res.send(error);
            res.send(data);
        });
    }
    return getFolderWithDate(date,(error,data)=>{
        if(error) return res.send(error);
        res.send(data);
    });
});

app.get('/datadrop/:date/:type',(req,res)=>{
    getDownloadLink(req.params.date,req.params.type,(error,data)=>{
        if(error) return res.send(error);
        res.send(data);
    });
});

app.get('*',(req,res)=>{
    res.send(`cannot resolve ${req.path}`);
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})