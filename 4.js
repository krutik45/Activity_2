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
    let matchResult = selectorTool(".widget-items.cta-link");
    let cardBtns_link = selectorTool(matchResult).find("a.label.blue-text.blue-on-hover");
    let link = selectorTool(cardBtns_link).attr("href");
    let matchResult_Link = "https://www.espncricinfo.com"+link;
    //console.log(matchResult_Link);    
    extract_link(matchResult_Link);
}

function extract_link(matchResult_Link) {
    request(matchResult_Link,cb);
    function cb(error, res, html) {
    if (error) {
       console.log(error)
    } else {
       extractFull_link(html);
   }
 }
    
}

function extractFull_link(html){
    let selectorTool = cheerio.load(html);
    let scoreCard = selectorTool(".col-md-8.col-16");
    //console.log(scoreCard.length);
        for (let i = 0; i < scoreCard.length; i++) {
            let cardBtns = selectorTool(scoreCard[i]).find(".btn.btn-sm.btn-outline-dark.match-cta");
            let link = selectorTool(cardBtns[2]).attr("href");
            let scoreCardLink = "https://www.espncricinfo.com"+link;
            //console.log(scoreCardLink);
            extract_Batsman(scoreCardLink);
        }
        
}

function extract_Batsman(scoreCardLink) {
    request(scoreCardLink,cb);
    function cb(error, res, html) {
    if (error) {
       console.log(error)
    } else {
       extract_batsmantable(html);
   }
 }
    
}

function extract_batsmantable(html){
    let selectorTool = cheerio.load(html);
    let teamNameElemArr = selectorTool(".Collapsible h5");
    let teamNameArr=[];

    for(let i = 0; i < teamNameElemArr.length; i++){
        let teamName = selectorTool(teamNameElemArr[i]).text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        //console.log(teamName);
        teamNameArr.push(teamName);
        buildFolder(teamName);

    }
    
    let batsmantable = selectorTool(".table.batsman");   
    let matchobj = [];
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
            matchobj.push({
                runs : runs,
                balls : balls
            })
            let fPath = path.join(__dirname,teamNameArr[i],name+".json");
            buildFile(fPath);
            console.log(name+" "+runs +" "+ balls +" "+ fours +" "+ sixes +" "+ strike_rate);
            if (fs.existsSync(fPath)) {
                let olddata = fs.readFileSync(fPath)
                olddata = JSON.parse(olddata)
                olddata.push(matchobj)
                fs.writeFileSync(fPath,JSON.stringify(olddata))
            } else {
                let arr = []
                arr.push(matchobj)
                fs.writeFileSync(fPath,JSON.stringify(arr));
            }
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

/*function writeInJason(fPath,arr){
    if (fs.existsSync(fPath)) {
        let olddata = fs.readFileSync(loc)
        olddata = JSON.parse(olddata)
        olddata.push(matchobj)
        fs.writeFileSync(loc,JSON.stringify(olddata))
    } else {
        let arr = []
        arr.push(matchobj)
        fs.writeFileSync(loc,JSON.stringify(arr))
    }
}
console.log('after');

/*const { fs, path } = require("../includes")

module.exports = (foldername, playername, matchobj) => {
    let loc = path.join(__dirname + "/../IPL 2020/" + foldername + "/" + playername + ".json");
    if (fs.existsSync(loc)) {
        let olddata = fs.readFileSync(loc)
        olddata = JSON.parse(olddata)
        olddata.push(matchobj)
        fs.writeFileSync(loc,JSON.stringify(olddata))
    } else {
        let arr = []
        arr.push(matchobj)
        fs.writeFileSync(loc,JSON.stringify(arr))
    }
} */