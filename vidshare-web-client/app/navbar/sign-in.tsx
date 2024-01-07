'use client';
import { Fragment } from "react";
import { signInWithGoogle, signOut } from "../utils/firebase/firebase";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            {
                user ? 
                (
                    <button 
                    className="inline-block border border-solid border-gray color-blue rounded-md px-10 py-5 cursor-pointer font-bold font-Roboto hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                    onClick={signOut}
                    >
                        Sign Out
                    </button>
                ) : (
                    <button 
                    className="inline-block border border-solid border-gray color-blue rounded-full px-10 py-5 cursor-pointer font-bold font-Roboto hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                    onClick={signInWithGoogle}
                    >
                        Sign In
                    </button>
                )

            }
        </Fragment>
    )
}