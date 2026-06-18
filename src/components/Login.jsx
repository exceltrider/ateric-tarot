import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0000] to-[#050000] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-crimson/10 border border-gold/30 p-8 rounded-md max-w-sm w-full">
        <h2 className="font-serif text-2xl text-cream text-center mb-4">Login Admin</h2>
        {error && <p className="text-red-300 text-xs mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 bg-cream-faint border border-crimson/30 rounded-sm text-cream"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 bg-cream-faint border border-crimson/30 rounded-sm text-cream"
          required
        />
        <button type="submit" className="w-full py-2 bg-crimson border border-gold/40 rounded-sm text-cream uppercase tracking-widest">
          Login
        </button>
      </form>
    </div>
  );
}