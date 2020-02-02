const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.static('public'))
 
app.get('/', function (req, res) {
    res.sendFile("index.html", { root: "." });
});
 
app.listen(PORT, () => {
    console.log(`LISTENING ON *:${PORT}`);
});