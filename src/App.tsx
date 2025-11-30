import React, { useEffect, useState } from "react";
import { handleCallback } from "./auth/authService";
import Login from "./Login";
import Dashboard from "./Dashboard";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const res = await handleCallback();
        if (res?.access_token) {
          setToken(res.access_token);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    void initAuth();
  }, []);

  if (loading) {
    return <p>Carregando autenticação...</p>;
  }

  if (!token) {
    return <Login />;
  }

  return <Dashboard token={token} />;
};

export default App;
