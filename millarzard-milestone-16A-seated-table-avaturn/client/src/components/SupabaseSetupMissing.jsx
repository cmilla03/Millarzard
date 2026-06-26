import React from "react";

function SupabaseSetupMissing({ onUseLocalMode }) {
  return (
    <main className="app">
      <section className="card-panel auth-panel">
        <div className="brand-header">
          <h1>MillarZard</h1>
          <p className="subtitle">Account login is ready, but Supabase is not connected yet.</p>
        </div>

        <div className="setup-missing-box">
          <h2>Missing Supabase variables</h2>
          <p>
            To use real accounts across devices, add these Netlify environment variables:
          </p>

          <pre>{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key`}</pre>

          <p>
            You can keep using local browser profiles while setting this up.
          </p>
        </div>

        <button onClick={onUseLocalMode}>Use Local Profile For Now</button>
      </section>
    </main>
  );
}

export default SupabaseSetupMissing;
