import { useState } from "react";
import { Link } from "react-router-dom";
import { loginWithFacebook } from "./facebookAuth";
import { LinkAccountsPrompt } from "./LinkAccountsPrompt";
import { requestOtpLogin } from "./otpAuth";
import { setCurrentUser } from "./session";
import {
  authenticateFacebookUser,
  findFacebookCollision,
  linkFacebookToExistingUser,
} from "./userStore";
import type { FacebookProfile } from "./facebookAuth";
import type { User } from "../../types/user";

export function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [pendingCollision, setPendingCollision] = useState<{
    user: User;
    profile: FacebookProfile;
  } | null>(null);

  async function handleLogin() {
    try {
      const profile = await loginWithFacebook();
      const user = authenticateFacebookUser(profile);
      if (!user) {
        const collision = findFacebookCollision(profile);
        if (collision) {
          setPendingCollision({ user: collision, profile });
          return;
        }
        setMessage("No account found. Please register with Facebook first.");
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
    const { user: collidingUser, profile } = pendingCollision;
    try {
      const verifiedIdentifier = await requestOtpLogin(
        collidingUser.otpIdentifier ?? "",
      );
      if (verifiedIdentifier !== collidingUser.otpIdentifier) {
        setPendingCollision(null);
        setMessage("Unable to verify ownership of the linked account. Please try again.");
        return;
      }
      const linkedUser = linkFacebookToExistingUser(collidingUser.id, profile);
      setCurrentUser(linkedUser);
      setPendingCollision(null);
      setMessage("Logged in successfully.");
    } catch {
      setPendingCollision(null);
      setMessage("Unable to verify ownership of the linked account. Please try again.");
    }
  }

  function handleDeclineLink() {
    setPendingCollision(null);
  }

  if (pendingCollision) {
    return (
      <main data-testid="login-page">
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
    <main data-testid="login-page">
      <h1>Login</h1>
      <button type="button" onClick={handleLogin}>
        Continue with Facebook
      </button>
      <p>
        <Link to="/login/otp">Continue with phone or email instead</Link>
      </p>
      {message && <p>{message}</p>}
    </main>
  );
}
