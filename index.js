const http= require("http");
const fs=require("fs");
var request=require("request");
// const { parse } = require("path");

const port =process.env.PORT || 8000;

const indexFile= fs.readFileSync("index.html","utf-8");

const replaceVal = (tempVal ,orgVal) => {
    let temperature =tempVal.replace("{%tempval%}", orgVal.main.temp);
     temperature =temperature.replace("{%tempmin%}", orgVal.main.temp_min);
     temperature =temperature.replace("{%tempmax%}", orgVal.main.temp_max);
     temperature =temperature.replace("{%location%}", orgVal.name);
     temperature =temperature.replace("{%Country%}", orgVal.sys.country);
     temperature =temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
     return temperature;
    }

const server =http.createServer((req, res) => {
    if(req.url=="/"){
        request("https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=7fe7219e4413d48d08980ebb8f31481f")
        .on("data", (chunk)=>{
            const objData =JSON.parse(chunk);
            const arrayData =[objData];

            const realTimeData = arrayData.map((val) =>  replaceVal(indexFile, val)).join("");
            res.write(realTimeData);

        })
        .on("end", (err)=>{
           if (err) return console.log("Connection Closed due to errors", err);

           res.end();
           console.log("end")
        })
    }
});

server.listen(port, ()=>{
    console.log('Listening');
})