const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const generateHTML = require("./generateHTML.js");
const writeFileAsync = util.promisify(fs.writeFile);
const axios = require("axios");
// var pdf = require('html-pdf');
const puppeteer = require('puppeteer');

function promptUser() {
    return inquirer.prompt(questions);
}

const questions = [
    {
        type: "input",
        name: "color",
        message: "What is your favorite color?"
    },
    {
        type: "input",
        name: "github",
        message: "Enter your GitHub Username"
    },
];

function writeToFile(fileName, data) {

}


async function init() {
    console.log("hi")
    try {
        const answers = await promptUser();
        console.log("answers: " + answers.color + answers.github);
        const { data } = await axios.get(
            `https://api.github.com/users/${answers.github}`);
        // console.log(data);

        const html = generateHTML.html(answers, data);
        await writeFileAsync("profile.html", html);

        const options = { format: 'Letter' };

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // await page.goto('https://news.ycombinator.com', { waitUntil: 'networkidle2' });
        await page.setContent(html);

        await page.pdf({ path: 'profile.pdf', format: 'A4' });

        await browser.close();
        // pdf.create(html, options).toFile('./profile.pdf', function(err, res) {
        //     if (err) return console.log(err);
        //     console.log(res); 
        //   });

        console.log("Successfully wrote to index.html");
    } catch (err) {
        console.log(err);
    }
}

init();