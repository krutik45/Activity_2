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
    let teamArr= [];
    let table = selectorTool(".table.table-sm.sidebar-widget-table.text-center.mb-0");
    let tableRow = selectorTool(table).find("tbody tr");
       // console.log(tableArr.length);
    for (let i = 0; i < tableRow.length; i++) {
        let tableCol = selectorTool(tableRow[i]).find("td");
        let name = selectorTool(tableCol[0]).text();
        teamArr.push(name);
        console.log(name);
     // buildFolder(name);
    }
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
    let batsmanTabelArr = selectorTool(".table.batsman");
    for(let i = 0; i < batsmanTabelArr.length; i++){
        let batsmanName = selectorTool(batsmanTabelArr[i]).find("tbody tr .batsman-cell");
        for(let j = 0; j < batsmanName.length; j++){
            let name = selectorTool(batsmanName[j]).text();
            console.log(name);
        }
        console.log("```````````````````````````");
    }
}

function buildFolder(folderName){
    let folderPath = path.join(__dirname,folderName);
    if(fs.existsSync(folderPath) == false){
        fs.mkdirSync(folderPath);
    }
}
console.log('after');