'use client'; 

import { useSearchParams } from "next/navigation";

export default function Watch() {

    const videoSrc = useSearchParams().get('v');
    const videoPrefix = 'https://storage.googleapis.com/ps-processed-videos-bucket/';

    return (
        <div className="">
            <h1>Watch Page</h1>
            <video src={videoPrefix + videoSrc} controls></video>
        </div>
    ); 
}