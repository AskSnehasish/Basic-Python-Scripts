const { spawn } = require("child_process");

function convertToCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function sanitizeString(str) {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .trim(); // Remove trailing spaces
}

function restructureData(data) {
  const objectCount = Object.keys(data["0"]).length - 1;
  let result = Array.from({ length: objectCount }, () => ({}));

  const sortedKeys = Object.keys(data).sort();

  for (let key of sortedKeys) {
    const property = convertToCamelCase(sanitizeString(data[key]["0"]));
    for (let i = 1; i <= objectCount; i++) {
      result[i - 1][property] = data[key][String(i)];
    }
  }

  return result;
}

async function processPythonScript() {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["./../python_scripts/ppt_reader_node.py"]);
    const list = ["PPT Reader Sample.pptx"];

    // Send data to python script
    python.stdin.write(JSON.stringify(list));
    python.stdin.end();

    // Receive data from python script
    python.stdout.on("data", (tableData) => {
      try {
        const tables = JSON.parse(tableData.toString().replaceAll("'", ""));
        const tableList = tables.map((data, index) => ({
          "table": "table" + index,
          "value": restructureData(data)
        }));

        resolve(tableList);
      } catch (error) {
        reject(new Error("Error parsing JSON: " + error));
      }
    });

    python.stderr.on("data", (data) => {
      reject(new Error(`Python Error: ${data}`));
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process closed with code ${code}`));
      }
    });
  });
}

processPythonScript()
  .then(result => console.log(result))
  .catch(error => console.error(error));
