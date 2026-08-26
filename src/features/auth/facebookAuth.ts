export type FacebookProfile = {
  id: string;
  name: string;
  email: string;
};

declare global {
  interface Window {
    FB?: {
      login: (
        callback: (response: { authResponse: unknown | null }) => void,
      ) => void;
      api: (
        path: string,
        params: Record<string, unknown>,
        callback: (profile: FacebookProfile) => void,
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

      window.FB?.api(
        "/me",
        { fields: "id,name,email" },
        (profile) => resolve(profile),
      );
    });
  });
}
