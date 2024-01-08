'use client'; 

import { Fragment } from "react";
import { uploadVideo } from "../utils/firebase/functions";

export default function Upload() {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0); 
        console.log("file in handleFileChange: ", file);
        if (file) {
            handleUpload(file);
        }
    }

    const handleUpload = async (file: File) => {
        console.log("file in handleUpload: ", file);
        try {
            const response = await uploadVideo(file);
            alert(`Successfully uploaded video. Response: ${JSON.stringify(response)}`);
        } catch (error) {
            alert(`Failed to upload video: ${error}`);
        }
    }

    return (
        <Fragment>
            <input className="hidden" type="file" accept="video/*" id="upload" onChange={handleFileChange}/>
            <label htmlFor="upload" className="flex justify-center items-center w-25 h-25 rounded-full color-black border-none cursor-pointer p-5 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </label>  
        </Fragment>
    )
}
