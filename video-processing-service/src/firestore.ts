import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({
    credential: credential.applicationDefault(),
    projectId: "vidshare-c0530"
})

const firestore = new Firestore();

const videoCollectionId = "videos";

export interface Video {
    id?: string;
    uid?: string;
    filename?: string;
    status?: "processing" | "processed";
    title?: string;
    description?: string; 
}

async function getVideo(videoId: string) {
    const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
    return (snapshot.data() as Video) ?? {};
}

export function setVideo(videoId: string, video: Video) {
    return firestore.collection(videoCollectionId).doc(videoId).set(video, {merge: true}); 
    // merge: true means that if the document already exists, it will merge the data instead of overwriting it
}

export async function isVideoNew(videoId: string) {
    const video = await getVideo(videoId);
    return video?.status === undefined;
}