import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

const generateUploadSignedUrl = httpsCallable(functions, "generateUploadSignedUrl"); 

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
        } 
    })

    return; 
}