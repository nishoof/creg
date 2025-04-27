"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const errorMessage = error
        ? decodeURIComponent(error as string)
        : "An unknown error occurred during authentication.";

    return (
        <div className="page">
            <main className="main">
                <div className="titleSection">
                    <h1>Authentication Error</h1>
                    <p>Please make sure you are logging in using your email ending in <strong>dons.usfca.edu</strong> and try again.</p>
                </div>
            </main>
        </div>
    );
}
