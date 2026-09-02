import { useState } from "react";
import { Link } from "react-router-dom";
import { loginWithFacebook } from "./facebookAuth";
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
  const [linkError, setLinkError] = useState<string | null>(null);

  async function handleLogin() {
    try {
      const verifiedIdentifier = await requestOtpLogin(identifier);
      const user = authenticateOtpUser(verifiedIdentifier);
      if (!user) {
        const collision = findOtpCollision(verifiedIdentifier);
        if (collision) {
          setLinkError(null);
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

  async function handleConfirmLink() {
    if (!pendingCollision) return;
    const { user: collidingUser, identifier: verifiedIdentifier } = pendingCollision;
    try {
      const profile = await loginWithFacebook();
      if (profile.id !== collidingUser.facebookId) {
        setLinkError("Unable to verify ownership of the linked account. Please try again.");
        return;
      }
      const linkedUser = linkOtpToExistingUser(collidingUser.id, verifiedIdentifier);
      setCurrentUser(linkedUser);
      setPendingCollision(null);
      setLinkError(null);
      setMessage("Logged in successfully.");
    } catch {
      setLinkError("Unable to verify ownership of the linked account. Please try again.");
    }
  }

  function handleDeclineLink() {
    setPendingCollision(null);
    setLinkError(null);
  }

  if (pendingCollision) {
    return (
      <main data-testid="otp-login-page">
        <h1>Login</h1>
        <LinkAccountsPrompt
          collidingUser={pendingCollision.user}
          error={linkError}
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
