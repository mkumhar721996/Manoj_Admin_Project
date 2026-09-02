import { useState } from "react";
import { Link } from "react-router-dom";
import { requestOtpRegistration } from "./otpAuth";
import { setCurrentUser } from "./session";
import { createUserFromOtpProfile } from "./userStore";

export function OtpRegisterPage() {
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleRegister() {
    try {
      const profile = await requestOtpRegistration(identifier, name);
      const user = createUserFromOtpProfile(profile);
      setCurrentUser(user);
      setMessage("Account created successfully.");
    } catch {
      setMessage("Registration failed. Please try again.");
    }
  }

  return (
    <main data-testid="otp-register-page">
      <h1>Register</h1>
      <label htmlFor="otp-register-identifier">Phone or email</label>
      <input
        id="otp-register-identifier"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
      />
      <label htmlFor="otp-register-name">Name</label>
      <input
        id="otp-register-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="button" onClick={handleRegister}>
        Create account
      </button>
      <p>
        <Link to="/register">Register with Facebook instead</Link>
      </p>
      {message && <p>{message}</p>}
    </main>
  );
}
