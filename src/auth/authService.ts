import { authConfig } from "./authConfig";
import { generatePkcePair } from "./pkce";

const STATE_KEY = "spotify_state";
const VERIFIER_KEY = "spotify_verifier";

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

export async function login(): Promise<void> {
  const state = crypto.randomUUID();
  const { code_verifier, code_challenge } = await generatePkcePair();

  sessionStorage.setItem(STATE_KEY, state);
  sessionStorage.setItem(VERIFIER_KEY, code_verifier);

  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    response_type: "code",
    redirect_uri: authConfig.redirectUri,
    scope: authConfig.scopes,
    state,
    code_challenge_method: "S256",
    code_challenge,
  });

  window.location.href = `${authConfig.authorizationEndpoint}?${params.toString()}`;
}

export async function handleCallback(): Promise<SpotifyTokenResponse | null> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    throw new Error(`Erro na autenticação: ${error}`);
  }

  if (!code) return null;

  const savedState = sessionStorage.getItem(STATE_KEY);
  if (!savedState || state !== savedState) {
    throw new Error("STATE inválido (possível CSRF).");
  }

  const code_verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!code_verifier) {
    throw new Error("Code verifier ausente.");
  }

  const body = new URLSearchParams({
    client_id: authConfig.clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: authConfig.redirectUri,
    code_verifier,
  });

  const response = await fetch(authConfig.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const txt = await response.text();
    console.error("Erro no token endpoint:", txt);
    throw new Error("Falha ao trocar código por token.");
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  return data;
}
