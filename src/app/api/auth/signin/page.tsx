"use client";

import { getCsrfToken, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

const SignIn = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      window.location.href = res.url || "/"; // Redirect to the specified URL or home
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form method="post" onSubmit={handleSubmit}>
        <input name="csrfToken" type="hidden" value={csrfToken || ""} />
        <div>
          <label>
            Username
            <input name="username" type="text" required />
          </label>
        </div>
        <div>
          <label>
            Password
            <input name="password" type="password" required />
          </label>
        </div>
        <button type="submit">Sign in</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SignIn;
