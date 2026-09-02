import { useState } from "react";
import { Link } from "react-router-dom";
import { LinkAccountsPrompt } from "./LinkAccountsPrompt";
import { requestOtpLogin } from "./otpAuth";
import { setCurrentUser } from "./session";
import {
  authenticateOtpUser,
  findOtpCollision,
  linkOtpToExistingUser,
} from "./userStore";
import type { User } from "../../types/user";

export function OtpLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pendingCollision, setPendingCollision] = useState<{
    user: User;
    identifier: string;
  } | null>(null);

  async function handleLogin() {
    try {
      const verifiedIdentifier = await requestOtpLogin(identifier);
      const user = authenticateOtpUser(verifiedIdentifier);
      if (!user) {
        const collision = findOtpCollision(verifiedIdentifier);
        if (collision) {
          setPendingCollision({ user: collision, identifier: verifiedIdentifier });
          return;
        }
        setMessage("No account found. Please register first.");
        return;
      }
      setCurrentUser(user);
      setMessage("Logged in successfully.");
    } catch {
      setMessage("Login failed. Please try again.");
    }
  }

  function handleConfirmLink() {
    if (!pendingCollision) return;
    const linkedUser = linkOtpToExistingUser(
      pendingCollision.user.id,
      pendingCollision.identifier,
    );
    setCurrentUser(linkedUser);
    setPendingCollision(null);
    setMessage("Logged in successfully.");
  }

  function handleDeclineLink() {
    setPendingCollision(null);
  }

  if (pendingCollision) {
    return (
      <main data-testid="otp-login-page">
        <h1>Login</h1>
        <LinkAccountsPrompt
          collidingUser={pendingCollision.user}
          onConfirm={handleConfirmLink}
          onDecline={handleDeclineLink}
        />
      </main>
    );
  }

  return (
    <main data-testid="otp-login-page">
      <h1>Login</h1>
      <label htmlFor="otp-login-identifier">Phone or email</label>
      <input
        id="otp-login-identifier"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        Continue
      </button>
      <p>
        <Link to="/login">Continue with Facebook instead</Link>
      </p>
      {message && <p>{message}</p>}
    </main>
  );
}
