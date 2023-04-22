const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (_, res) => {
    res.send("Earth back to moon!");
});

app.listen(PORT, () => console.log(`Server is on port: ${PORT}`));
