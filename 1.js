let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

console.log("before");
request(url,cb);
function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else{
        extractHtml(html);
    }
}
function extractHtml(html){
    let selectorTool = cheerio.load(html);
    let teamNameElemArr = selectorTool(".Collapsible h5");
    let teamNameArr=[];

    for(let i = 0; i < teamNameElemArr.length; i++){
        let teamName = selectorTool(teamNameElemArr[i]).text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        console.log(teamName);
        teamNameArr.push(teamName);
        buildFolder(teamName);

    }
    
    let batsmantable = selectorTool(".table.batsman");
   
    for (let i = 0; i < batsmantable.length; i++) {
        let singleInningBat = selectorTool(batsmantable[i]).find("tbody tr");
        for (let j = 0; j < singleInningBat.length; j++) {
            let singleAllCol = selectorTool(singleInningBat[j]).find("td");
            let name = selectorTool(singleAllCol[0]).text();
            let runs = selectorTool(singleAllCol[2]).text();
            let balls = selectorTool(singleAllCol[3]).text();
            let fours = selectorTool(singleAllCol[5]).text();
            let sixes = selectorTool(singleAllCol[6]).text();
            let strike_rate= selectorTool(singleAllCol[7]).text();
            console.log(name+" "+runs +" "+ balls +" "+ fours +" "+ sixes +" "+ strike_rate);
            let fPath = path.join(__dirname,teamNameArr[i],name + ".json");
            buildFile(fPath);
        }
        console.log("```````````````````````````````");
        // get all bowler name, wickets
    }
}
function buildFolder(folderName){
    let folderPath = path.join(__dirname,folderName);
    if(fs.existsSync(folderPath) == false){
        fs.mkdirSync(folderPath);
    }
}

function buildFile(filePath){
    if(fs.existsSync(filePath) == false){
        let createStream = fs.createWriteStream(filePath);
        createStream.end(); 
    }
}


console.log('after');