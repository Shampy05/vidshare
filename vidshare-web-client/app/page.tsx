import { getVideos } from "./utils/firebase/functions"; 
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const videos = await getVideos(); 
  return (
    <main>
      {
        videos.map((video) => (
          // eslint-disable-next-line react/jsx-key
          <Link 
          href={`/watch?v=${video.filename}`}
          key={video.id}
          >
            <Image 
            src={'/tiny-video-symbol.png'} 
            alt='video' 
            width={120} 
            height={80} 
            className="m-10"
            />
          </Link>
        ))
      }
    </main>
  )
}

export const revalidate = 30; 
