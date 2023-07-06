const { spawn } = require("child_process");

const python = spawn("python3", ["./../python_scripts/ppt_reader_node.py"]);

list = ["PPT Reader Sample.pptx"];
// Send data to python script
python.stdin.write(JSON.stringify(list));
python.stdin.end();

// Receive data from python script
python.stdout.on("data", (rdata) => {
  let data = JSON.parse(rdata);
  let objectCount = Object.keys(data["0"]).length - 1;

  let result = Array.from({ length: objectCount }, () => ({}));

  // Sorting keys to ensure order
  let outerKeys = Object.keys(data).sort();

  for (let outerKey of outerKeys) {
    let property = data[outerKey]["0"].toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    for (let i = 1; i <= objectCount; i++) {
      result[i - 1][property] = data[outerKey][String(i)];
    }
  }

  console.log(result);
});

python.stderr.on("data", (data) => {
  console.error(`Python Error: ${data}`);
});

python.on("close", (code) => {
  console.log(`Python process closed with code ${code}`);
});
