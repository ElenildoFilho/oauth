import React, { useState } from "react";

interface DashboardProps {
  token: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
}

interface SpotifyProfile {
  id: string;
  display_name: string;
  email?: string;
  country?: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  tracks: {
    total: number;
  };
  public: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile() {
    setError(null);
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Falha ao carregar perfil.");

      const data = (await res.json()) as SpotifyProfile;
      setProfile(data);
    } catch (e: any) {
      setError(e.message ?? "Erro desconhecido");
    }
  }

  async function loadTopTracks() {
    setError(null);
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Falha ao carregar top tracks.");

      const data = await res.json();
      setTracks(data.items || []);
    } catch (e: any) {
      setError(e.message ?? "Erro desconhecido");
    }
  }

  async function loadPlaylists() {
    setError(null);
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/playlists?limit=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Falha ao carregar playlists.");

      const data = await res.json();
      setPlaylists(data.items || []);
    } catch (e: any) {
      setError(e.message ?? "Erro desconhecido");
    }
  }

  return (
    <div
      style={{
        padding: 20,
        color: "#fff",
        backgroundColor: "#111",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Dashboard Spotify</h1>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={loadProfile}
          style={{ marginRight: 8, padding: "8px 16px", cursor: "pointer" }}
        >
          Carregar meu perfil
        </button>

        <button
          onClick={loadTopTracks}
          style={{ marginRight: 8, padding: "8px 16px", cursor: "pointer" }}
        >
          Top 5 músicas
        </button>

        <button
          onClick={loadPlaylists}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Minhas playlists
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {profile && (
        <div style={{ marginBottom: 24 }}>
          <h2>Perfil</h2>
          <p><strong>Nome:</strong> {profile.display_name}</p>
          <p><strong>Email:</strong> {profile.email ?? "—"}</p>
          <p><strong>País:</strong> {profile.country ?? "—"}</p>
          <p><strong>ID:</strong> {profile.id}</p>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h2>Top tracks</h2>
        <p>Total: {tracks.length}</p>
        <ol>
          {tracks.map((t) => (
            <li key={t.id} style={{ marginBottom: 8 }}>
              <strong>{t.name}</strong> —{" "}
              {t.artists.map((a) => a.name).join(", ")}
            </li>
          ))}
        </ol>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2>Playlists</h2>
        <p>Total: {playlists.length}</p>
        {playlists.length === 0 && <p>Nenhuma playlist encontrada.</p>}
        <ul>
          {playlists.map((p) => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <strong>{p.name}</strong> — {p.tracks.total} músicas (
              {p.public ? "pública" : "privada"})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
