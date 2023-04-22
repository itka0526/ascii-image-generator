const express = require("express");
const multer = require("multer");
const asciify = require("asciify-image");
const sizeOf = require("image-size");

const app = express();
const upload = multer();
const PORT = process.env.PORT || 4000;

app.use(express.static("./public/"));
app.use(express.json());

async function convert(image, config) {
    let result;

    await asciify(image, { fit: "box", ...config })
        .then(function (asciified) {
            // Print asciified image to console
            result = asciified;
        })
        .catch(function (_) {
            // Print error to console
            result = "Something went wrong.";
        });

    return result;
}

app.post("/convert", upload.single("image"), async (req, res) => {
    const data = req.file;

    try {
        const dimensions = await sizeOf(data.buffer);

        let scalar = 0.25;

        if (dimensions.height <= 250 || dimensions.width <= 250) scalar = 0.5;

        const config = {
            height: dimensions.height * scalar,
            width: dimensions.width * scalar,
            color: false,
        };

        const result = await convert(data.buffer, config);

        res.set("Content-Type", "text/html");
        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body {
                            height: 100%;
                            width: 100%;
                            position: fixed;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    </style>
                </head>
                <body>
                    <pre id="area" style="font-size: 5px; overflow: scroll;"> ${result} </pre>
                    <input id="in" style="position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);" type="range" min="0.5" max="5">
                    <script>
                        document.getElementById("in").addEventListener("input", (event) => {
                            const v = event.target.value;
                            document.getElementById("area").style.fontSize = 5 * v + "px";
                        })
                    </script>
                </body>
            </html>
        `);
    } catch (_) {
        res.status(500).send("Something went wrong.");
    }
});

app.listen(PORT, () => console.log(`Server is on port: ${PORT}`));
