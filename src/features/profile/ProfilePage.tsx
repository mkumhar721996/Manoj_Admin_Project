import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCurrentUser, getCurrentUser, setCurrentUser } from "../auth/session";
import { updateUser } from "../auth/userStore";

export function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!currentUser) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateUser(currentUser.id, currentUser.facebookId, {
        name,
        phone,
        email,
      });
      setCurrentUser(updated);
      setName(updated.name);
      setPhone(updated.phone ?? "");
      setEmail(updated.email);
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    clearCurrentUser();
    navigate("/login");
  }

  return (
    <main data-testid="profile-page">
      <h1>Profile</h1>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Phone number
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="button" onClick={handleSave} disabled={isSaving}>
        Save
      </button>
      {isSaving && <p role="status">Saving…</p>}
      {error && <p role="alert">{error}</p>}
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </main>
  );
}
