"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      router.push("/"); // Redirect to home page if logged in
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the API route instead of connecting directly to MongoDB
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store username in localStorage
        localStorage.setItem("currentUser", username);

        // Redirect to home page
        router.push("/");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Image
          src="/USFCABackground.jpg"
          alt="Background"
          className={styles.heroImage}
          width={1920}
          height={1080}
          priority
        />
        <div className={styles.heroOverlay}></div>
        <div className={styles.loginForm}>
          <div className={styles.header}>
            <h1 className={styles.title}>Course Registration</h1>
            <p className={styles.subtitle}>Sign in to register for courses</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={styles.input}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
