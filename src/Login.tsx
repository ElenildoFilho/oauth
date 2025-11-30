import React from "react";
import { login } from "./auth/authService";

const Login: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Spotify OAuth + PKCE</h1>
      <p>Clique abaixo para entrar com sua conta Spotify.</p>
      <button onClick={() => login()}>Entrar com Spotify</button>
    </div>
  );
};

export default Login;
