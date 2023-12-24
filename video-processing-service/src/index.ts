import express from "express";
import ffmpeg from "fluent-ffmpeg"; // wrapper around cli ffmpeg

const app = express();
app.use(express.json()); // parse json request body

app.post("/process-video", (req, res) => {
    // get path of video to process from the request body
    const inputPath = req.body.inputPath; 
    const outputPath = req.body.outputPath;

    if (!inputPath || !outputPath) {
        res.status(400).send("Missing input or output path");
    }

    ffmpeg(inputPath)
    .outputOption("-vf", "scale=-1:360") // scale to 360p
    .on("end", () => {
        console.log("Video processing finished");
        res.status(200).send("Video processing finished");
    })
    .on("error", (err) => {
        console.log(`Error processing video: ${err.message}`);
        res.status(500).send(`Error processing video: ${err.message}`);
    })
    .save(outputPath);
}); 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`); 
}); 