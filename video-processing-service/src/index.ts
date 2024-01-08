import express from "express";
import ffmpeg from "fluent-ffmpeg"; // wrapper around cli ffmpeg
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { error } from "console";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories(); 

const app = express();
app.use(express.json()); // parse json request body

app.get("/", (req, res) => {
    res.send("Hi")
})

app.post("/process-video", async (req, res) => {
    // get the bucket and filename from cloud Pub/Sub message 
    let data; 
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8'); 
        data = JSON.parse(message); 
        if (!data.name) {
            throw new Error('Invalid message payload recceived.'); 
        }
    } catch (error) {
        console.error(error); 
        return res.status(400).send("Bad request: missing filename."); 
    }

    const inputFileName = data.name; // format is <UID>-<DATE>.<EXTENSION>
    const outputFileName = `processed-${data.name}`; 
    const videoId = inputFileName.split(".")[0];

    if (!isVideoNew(videoId)) {
        return res.status(400).send("Video has already been processed.");
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: inputFileName.split("-")[0],
            status: "processing"
        })
    }

    // Download the raw video from cloud storage to the local filesystem 
    await downloadRawVideo(inputFileName); 

    // Process the video to 360p 
    try {
        await convertVideo(inputFileName, outputFileName); 
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]); 
        console.log(err);
        return res.status(500).send('Internal server error: video processing failed.');  
    }

    // Upload the processed video to cloud storage from the local filesystem
    await uploadProcessedVideo(outputFileName); 

    // Update the video status in firestore
    await setVideo(videoId, {
        status: "processed",
        filename: outputFileName
    });

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]); 

    return res.status(200).send("Processing finished successfully"); 
}); 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`); 
}); 