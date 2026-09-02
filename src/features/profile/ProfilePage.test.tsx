import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfilePage } from "./ProfilePage";
import { clearCurrentUser, getCurrentUser, setCurrentUser } from "../auth/session";
import { updateUser } from "../auth/userStore";

vi.mock("../auth/session");
vi.mock("../auth/userStore");

function renderProfilePage() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUser).mockReset();
    vi.mocked(setCurrentUser).mockReset();
    vi.mocked(clearCurrentUser).mockReset();
    vi.mocked(updateUser).mockReset();
  });

  describe("viewing the profile", () => {
    it("shows the current user's name, phone, and email", () => {
      vi.mocked(getCurrentUser).mockReturnValue({
        id: "user-1",
        facebookId: "fb-1",
        name: "Jane Doe",
        phone: "555-0100",
        email: "jane@example.com",
      });

      renderProfilePage();

      expect(screen.getByLabelText(/name/i)).toHaveValue("Jane Doe");
      expect(screen.getByLabelText(/phone/i)).toHaveValue("555-0100");
      expect(screen.getByLabelText(/email/i)).toHaveValue("jane@example.com");
    });

    it("renders an empty phone field when the user has no phone on record", () => {
      vi.mocked(getCurrentUser).mockReturnValue({
        id: "user-1",
        facebookId: "fb-1",
        name: "Jane Doe",
        email: "jane@example.com",
      });

      renderProfilePage();

      expect(screen.getByLabelText(/phone/i)).toHaveValue("");
    });
  });

  describe("editing and saving", () => {
    it("persists edited fields and reflects them immediately in the UI", async () => {
      const currentUser = {
        id: "user-1",
        facebookId: "fb-1",
        name: "Jane Doe",
        phone: "555-0100",
        email: "jane@example.com",
      };
      const updatedUser = {
        ...currentUser,
        name: "Jane Smith",
        phone: "555-0200",
        email: "jane.smith@example.com",
      };
      vi.mocked(getCurrentUser).mockReturnValue(currentUser);
      vi.mocked(updateUser).mockResolvedValue(updatedUser);

      const user = userEvent.setup();
      renderProfilePage();

      await user.clear(screen.getByLabelText(/name/i));
      await user.type(screen.getByLabelText(/name/i), "Jane Smith");
      await user.clear(screen.getByLabelText(/phone/i));
      await user.type(screen.getByLabelText(/phone/i), "555-0200");
      await user.clear(screen.getByLabelText(/email/i));
      await user.type(screen.getByLabelText(/email/i), "jane.smith@example.com");
      await user.click(screen.getByRole("button", { name: /save/i }));

      await screen.findByDisplayValue("Jane Smith");

      expect(updateUser).toHaveBeenCalledWith("user-1", {
        name: "Jane Smith",
        phone: "555-0200",
        email: "jane.smith@example.com",
      });
      expect(setCurrentUser).toHaveBeenCalledWith(updatedUser);
      expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
      expect(screen.getByDisplayValue("555-0200")).toBeInTheDocument();
      expect(screen.getByDisplayValue("jane.smith@example.com")).toBeInTheDocument();
    });
  });

  describe("saving in progress", () => {
    it("disables the save control and shows a loading indicator while saving", async () => {
      const currentUser = {
        id: "user-1",
        facebookId: "fb-1",
        name: "Jane Doe",
        phone: "555-0100",
        email: "jane@example.com",
      };
      vi.mocked(getCurrentUser).mockReturnValue(currentUser);
      let resolveUpdate: (user: typeof currentUser) => void;
      const pending = new Promise<typeof currentUser>((resolve) => {
        resolveUpdate = resolve;
      });
      vi.mocked(updateUser).mockReturnValue(pending);

      const user = userEvent.setup();
      renderProfilePage();

      const saveButton = screen.getByRole("button", { name: /save/i });
      await user.click(saveButton);

      expect(saveButton).toBeDisabled();
      expect(screen.getByRole("status")).toHaveTextContent(/saving/i);

      resolveUpdate!(currentUser);
      await waitFor(() => expect(saveButton).not.toBeDisabled());
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("logging out", () => {
    it("clears the session when the user logs out", async () => {
      vi.mocked(getCurrentUser).mockReturnValue({
        id: "user-1",
        facebookId: "fb-1",
        name: "Jane Doe",
        phone: "555-0100",
        email: "jane@example.com",
      });

      const user = userEvent.setup();
      renderProfilePage();

      await user.click(screen.getByRole("button", { name: /log out/i }));

      expect(clearCurrentUser).toHaveBeenCalledOnce();
    });
  });
});
