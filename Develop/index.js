const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const generateHTML = require("./generateHTML.js");
const writeFileAsync = util.promisify(fs.writeFile);
const axios = require("axios");
const PDFDocument = require('pdfkit');

// Create a document
const doc = new PDFDocument;

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream('output.pdf'));

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

        const { data } = await axios.get(
            `https://api.github.com/users/${answers.github}/repos?per_page=100`);
        console.log(data[0]);
        // Add an image, constrain it to a given size, and center it vertically and horizontally
        // doc.image(data[0].avatar_url, {
        //     fit: [250, 300],
        //     align: 'center',
        //     valign: 'center'
        // });
        // Add some text with annotations
        doc.addPage()
            .fillColor("blue")
            .text('Here is a link!', 100, 100)
            .underline(100, 100, 160, 27, { color: "#0000FF" })
            .link(100, 100, 160, 27, data[0].owner.html_url);

        // Finalize PDF file
        doc.end();

        const html = generateHTML.html(answers);

        await writeFileAsync("index.html", html);

        console.log("Successfully wrote to index.html");
    } catch (err) {
        console.log(err);
    }
}

init();