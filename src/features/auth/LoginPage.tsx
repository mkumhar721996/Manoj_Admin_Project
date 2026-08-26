import { useState } from "react";
import { loginWithFacebook } from "./facebookAuth";
import { setCurrentUser } from "./session";
import { authenticateFacebookUser } from "./userStore";

export function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin() {
    const profile = await loginWithFacebook();
    const user = authenticateFacebookUser(profile);
    if (!user) {
      setMessage("No account found. Please register with Facebook first.");
      return;
    }
    setCurrentUser(user);
    setMessage("Logged in successfully.");
  }

  return (
    <main data-testid="login-page">
      <h1>Login</h1>
      <button type="button" onClick={handleLogin}>
        Continue with Facebook
      </button>
      {message && <p>{message}</p>}
    </main>
  );
}
