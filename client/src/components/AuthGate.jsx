import React, { useState } from "react";
import { supabase } from "../supabaseClient";

function AuthGate() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter an email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });

        if (error) throw error;

        if (!data.session) {
          setStatusMessage("Account created. Check your email to confirm it, then sign in.");
        } else {
          setStatusMessage("Account created.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app">
      <section className="card-panel auth-panel">
        <div className="brand-header">
          <h1>MillarZard</h1>
          <p className="subtitle">Sign in to save your avatar, wins, and profile across devices.</p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "signin" ? "auth-toggle-active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "auth-toggle-active" : ""}
            onClick={() => setMode("signup")}
          >
            Create Account
          </button>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}
        {statusMessage && <p className="success-message">{statusMessage}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Working..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="profile-note dark-note">
          This uses Supabase accounts. Your password is handled by Supabase Auth, not by the game server.
        </p>
      </section>
    </main>
  );
}

export default AuthGate;
