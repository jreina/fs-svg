const fsWalker = require("./fs-walker");
const fs = require("fs");

const tree = fsWalker.Walk("c:\\", 3);
fs.writeFileSync(`./trees/${new Date().toISOString().replace(/[-:.]/g, "")}.json`, JSON.stringify(tree));
