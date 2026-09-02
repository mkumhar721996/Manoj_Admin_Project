import type { User } from "../../types/user";

type LinkAccountsPromptProps = {
  collidingUser: User;
  error?: string | null;
  onConfirm: () => void;
  onDecline: () => void;
};

export function LinkAccountsPrompt({
  collidingUser,
  error,
  onConfirm,
  onDecline,
}: LinkAccountsPromptProps) {
  const identifier = collidingUser.email ?? collidingUser.otpIdentifier;

  return (
    <div role="dialog" aria-modal="true" aria-label="Link accounts">
      <p>
        An account already exists for {identifier}. Link this login method to
        that account?
      </p>
      {error && <p>{error}</p>}
      <button type="button" onClick={onConfirm}>
        Link accounts
      </button>
      <button type="button" onClick={onDecline}>
        Not now
      </button>
    </div>
  );
}
