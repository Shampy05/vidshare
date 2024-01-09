import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadSignedUrl = httpsCallable(functions, "generateUploadSignedUrl");
const getVideosFunction = httpsCallable(functions, "getVideos");

export interface Video {
    id?: string;
    uid?: string;
    status?: string;
    filename?: string;
    title?: string;
    description?: string;
}

export async function uploadVideo(file: File) {
    console.log("Uploading video...");
    console.log("File: ", file);
    console.log("generateUploadSignedUrl: ", generateUploadSignedUrl);
    const response: any = await generateUploadSignedUrl({
        fileExtension: file.name.split(".").pop()
    })
    console.log("Response: ", response); 

    // upload the video via the signed URL
    await fetch(response?.data?.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        },
    })

    return; 
}

export async function getVideos() {
    const response: any = await getVideosFunction();
    return response.data as Video[];
}