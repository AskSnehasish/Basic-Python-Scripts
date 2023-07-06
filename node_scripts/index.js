const { spawn } = require("child_process");

function toCamelCase(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function cleanString(str) {
    // Remove brackets and special characters
    str = str.replace(/[^a-zA-Z0-9\s]/g, '');
    
    // Remove trailing spaces
    str = str.replace(/\s+$/, '');
    return str;
}

function transformData(data) {
    let objectCount = Object.keys(data["0"]).length - 1;
    let result = Array.from({ length: objectCount }, () => ({}));

    // Sorting keys to ensure order
    let outerKeys = Object.keys(data).sort();

    for (let outerKey of outerKeys) {
        let property = toCamelCase(cleanString(data[outerKey]["0"]));
        for (let i = 1; i <= objectCount; i++) {
            result[i - 1][property] = data[outerKey][String(i)];
        }
    }

    return result;
}

const python = spawn("python3", ["./../python_scripts/ppt_reader_node.py"]);

let list = ["PPT Reader Sample.pptx"];

// Send data to python script
python.stdin.write(JSON.stringify(list));
python.stdin.end();

// Receive data from python script
python.stdout.on("data", (rdata) => {
    try {
        let data = JSON.parse(rdata);
        let result = transformData(data);
        console.log(result);
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
});

python.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
});

python.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
});
