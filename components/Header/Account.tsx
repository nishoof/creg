"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Header.module.css";
import { MouseEventHandler } from "react";

export default function Account() {
    const { data: session } = useSession();
    const loggedIn = session && session.user;

    const buttonOnClick: MouseEventHandler<HTMLButtonElement> = loggedIn ?
        () => signOut() :
        () => signIn("google", { callbackUrl: "/" });
    const buttonText = loggedIn ? "Sign out" : "Sign in";

    return (
        <button
            onClick={buttonOnClick}
            className={`${styles.navButton} ${styles.accountButton}`}
        >
            {buttonText}
        </button>
    );
}
