export type FacebookProfile = {
  id: string;
  name: string;
  email: string;
};

type FacebookApiResponse = FacebookProfile & { error?: { message: string } };

declare global {
  interface Window {
    FB?: {
      login: (
        callback: (response: { authResponse: unknown | null }) => void,
      ) => void;
      api: (
        path: string,
        params: Record<string, unknown>,
        callback: (response: FacebookApiResponse) => void,
      ) => void;
      getLoginStatus: (
        callback: (response: { status: string }) => void,
      ) => void;
    };
  }
}

export function loginWithFacebook(): Promise<FacebookProfile> {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error("Facebook SDK is not available"));
      return;
    }

    window.FB.login((response) => {
      if (!response.authResponse) {
        reject(new Error("Facebook login was cancelled"));
        return;
      }

      window.FB?.api("/me", { fields: "id,name,email" }, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
          return;
        }
        resolve(response);
      });
    });
  });
}

// Reads identity from Facebook's own session, which a user can't forge by editing local app storage.
export function getCurrentFacebookProfile(): Promise<FacebookProfile> {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error("Facebook SDK is not available"));
      return;
    }

    window.FB.getLoginStatus((statusResponse) => {
      if (statusResponse.status !== "connected") {
        reject(new Error("Not connected to Facebook"));
        return;
      }

      window.FB?.api("/me", { fields: "id,name,email" }, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
          return;
        }
        resolve(response);
      });
    });
  });
}
