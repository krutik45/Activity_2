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
    console.log(matchResult_Link);    
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
    console.log(scoreCard.length);
        for (let i = 0; i < scoreCard.length; i++) {
            let cardBtns = selectorTool(scoreCard[i]).find(".btn.btn-sm.btn-outline-dark.match-cta");
            let link = selectorTool(cardBtns[2]).attr("href");
            let scoreCardLink = "https://www.espncricinfo.com"+link;
            console.log(scoreCardLink);
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
        console.log(teamName);
        teamNameArr.push(teamName);
        buildFolder(teamName);

    }
    
    let batsmanTabelArr = selectorTool(".table.batsman");

    for(let i = 0; i < batsmanTabelArr.length; i++){
        let batsmanNameAnchor = selectorTool(batsmanTabelArr[i]).find("tbody tr .batsman-cell a");
        let arr = [];
        for(let j = 0; j < batsmanNameAnchor.length; j++){
            let name = selectorTool(batsmanNameAnchor[j]).text();
            arr.push({
                "Name" : name,
                
            })
            //let teamName = teamNameArr[i];
            //let link = selectorTool(batsmanNameAnchor[j]).attr("href");
            //printBirthdays(link,name,teamName);
            console.log(name + " of " +teamNameArr[i]);
            let filePath = path.join(__dirname,teamNameArr[i],name + ".json");
            buildFile(filePath);
            
        }         
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