import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./session";

export function RequireAuth({ children }: { children: ReactElement }) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
