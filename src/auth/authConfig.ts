export interface AuthConfig {
  clientId: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  redirectUri: string;
  scopes: string;
}

export const authConfig: AuthConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",

  redirectUri: "https://jefim9413.github.io/spotify-oauth/",

  scopes: "user-read-email user-read-private user-top-read playlist-read-private",
};
