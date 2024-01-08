'use client';

import Image from "next/image";
import Link from "next/link"; 
import SignIn from "./sign-in";
import { onAuthStateChange } from "../utils/firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {
    // init user state 
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((user) => {
            setUser(user);
        }); 

        // unsubscribe from auth state change listener
        return () => unsubscribe();
    })

    return (
        <div className="flex justify-between items-center px-10 py-5">
            <Link href="/">
                <Image 
                width={70}
                height={70}
                src="/vidshare-logo.png" 
                alt="Vidshare Logo" 
                />
            </Link>
            {
                user && <Upload />
            }
            <SignIn user={user} />
        </div>
    ); 
}