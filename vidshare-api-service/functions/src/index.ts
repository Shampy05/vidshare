import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {setGlobalOptions} from "firebase-functions/v2";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

// Set the maximum instances to 10 for all functions
setGlobalOptions({maxInstances: 10});

initializeApp(); // initialize the firebase app

const db = new Firestore(); // initialize the firestore database
const storage = new Storage(); // initialize the storage

const rawVideosBucketName = "ps-raw-videos-bucket";
// TODO: use config to get the name of the raw videos bucket in future

/**
 * Triggered when a new user is created in Firebase Auth
 * @param user The user that was created
 * @returns A promise that resolves when the user has been created
 */
export const createUser = functions.auth.user().onCreate((user) => {
    // create the user info object
    const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime,
    };

    // write the user info to the database
    db.collection("users").doc(user.uid).set(userInfo);

    logger.info(`New user created: ${JSON.stringify(userInfo)}`);
    return;
});

/**
 * Triggered when a new video is uploaded to the raw videos bucket
 * @param object The object that was uploaded
 * @param context The event context
 * @returns A promise that resolves when the video has been processed
 */
export const generateUploadSignedUrl = onCall(
    {maxInstances: 10},
    async (request) => {
    // check if user is authenticated
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be signed in to use this feature"
            );
    }

    const auth = request.auth;
    const data = request.data; // data is the video name
    const bucket = storage.bucket(rawVideosBucketName);

    // generate a unique file name for the video
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // get a v4 signed URL for the video
    const [signedUrl] = await bucket.file(fileName).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return {
        fileName,
        signedUrl,
    };
});
