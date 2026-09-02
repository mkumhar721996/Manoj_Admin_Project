export type OtpProfile = {
  identifier: string;
  name: string;
};

export function requestOtpLogin(identifier: string): Promise<string> {
  return Promise.resolve(identifier);
}

export function requestOtpRegistration(
  identifier: string,
  name: string,
): Promise<OtpProfile> {
  return Promise.resolve({ identifier, name });
}
