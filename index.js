var express = require('express');
var router = express.Router();
var fs=require('fs');
const cheerio = require('cheerio');
const request = require('request');
var rp = require('request-promise');
const url = 'https://www.otomoto.pl/osobowe/mercedes-benz/?page=';
var counter=0;
var json = { link:''};


function promiseMaker(url){
    return new Promise(function(resolve, reject){
        request({
                method: 'GET',
                url: url
            },
            async (err, res, body) => {
                if (err) return console.error(err);
                let $ = cheerio.load(body);
                resolve($);
            });
    })
}
async function main() {
    var links=[];
    for(let j=1;j<=3;j++){
        console.log(j.toString());
        let $ = await promiseMaker(url+j.toString());
        await $('article').each(function (i, e) {
            links.push($(this).attr('data-href'));
        });
    }

    json.links = links;
    fs.writeFile('output'.toString() + '.json', JSON.stringify(json, null, 4), function (err) {

        console.log('File '.toString() + ' written');

    });
}
main();