import { Storage } from "@google-cloud/storage";
import fs from 'fs'; 
import ffmpeg from "fluent-ffmpeg";
import { dir, log } from "console";

/**
 * The purpoe of this file is to - 
 * - Keep track of Google Cloud Storage file instructions 
 * - Keep track of local file interactions
 */

const storage = new Storage(); 

const rawVideoBucketName = "ps-raw-videos-bucket"; 
const processedVideoBucketName = "ps-processed-videos-bucket"; 

const localRawVideoPath = "./raw-videos"; 
const localProcessedVideoPath = "./processed-videos"; 

/**
 * Create the local directories for raw and processed videos
 */ 
export function setupDirectories() {
    ensureDirectoryExists(localRawVideoPath); 
    ensureDirectoryExists(localProcessedVideoPath); 
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns - A promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOption("-vf", "scale=-1:360") // scale to 360p
        .on("end", () => {
            console.log("Video processing finished");
            resolve(); 
        })
        .on("error", (err) => {
            console.log(`Error processing video: ${err.message}`);
            reject(err); 
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })
}

/**
 * @param fileName - The name of the file to download from the {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder. 
 * @returns - A promise that resolves when the file has been downloaded. 
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({ destination: `${localRawVideoPath}/${fileName}` })

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
    );
    
}

/**
 * @param fileName - The name of the file to upload from the {@link localProcessedVideoPath} bucket into the {@link processedVideoBucketName} folder. 
 * @returns - A promise that resolves when the file has been uploaded. 
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName); 

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    }); 

    console.log(
        `${localProcessedVideoPath}/${fileName} has been uploaded to the gs://${processedVideoBucketName}/${fileName}`
    );
    

    await bucket.file(fileName).makePublic(); 
}

/**
 * @param fileName - The name of the file to delete from {@link localRawVideoPath} folder.
 * @returns - A promise that resolved when the video has been deleted. 
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`); 
} 

/**
 * @param fileName - The name of the file to delete from {@link localProcessedVideoPath} folder.
 * @returns - A promise that resolved when the video has been deleted. 
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`); 
} 

/**
 * @param filePath - The path of the file to delete 
 * @returns - A promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`);
                    console.log(JSON.stringify(err));
                    reject(err); 
                } else {
                    console.log(`File deleted at ${filePath}`);
                    resolve(); 
                }
            })
        } else {
            reject(`File ${filePath} does not exist.`); 
        }
    })
}

/**
 * Ensures a directory exists, created if it is necessary. 
 * @param {string} dirPath - The directory path to check. 
 */
function ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); 
        console.log(`Directory created at ${dirPath}`)
    }
}