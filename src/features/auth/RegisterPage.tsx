import { useState } from "react";
import { loginWithFacebook } from "./facebookAuth";
import { setCurrentUser } from "./session";
import { createUserFromFacebookProfile } from "./userStore";

export function RegisterPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleRegister() {
    try {
      const profile = await loginWithFacebook();
      const user = createUserFromFacebookProfile(profile);
      setCurrentUser(user);
      setMessage("Account created successfully.");
    } catch {
      setMessage("Registration failed. Please try again.");
    }
  }

  return (
    <main data-testid="register-page">
      <h1>Register</h1>
      <button type="button" onClick={handleRegister}>
        Continue with Facebook
      </button>
      {message && <p>{message}</p>}
    </main>
  );
}
