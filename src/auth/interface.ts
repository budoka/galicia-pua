export interface JWTPayload {
  aud: string;
  iss: string;
  iat: string;
  exp: string;
  name: string;
  unique_name: string;
}
