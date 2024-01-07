import Image from "next/image";
import Link from "next/link"; 

export default function Navbar() {
    return (
        <div className="flex space-between items-center p-4">
            <Link href="/">
                <Image 
                width={70}
                height={70}
                src="/vidshare-logo.png" 
                alt="Vidshare Logo" 
                />
            </Link>
        </div>
    ); 
}