import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setErro('Usuário não encontrado.');
      } else if (err.code === 'auth/wrong-password') {
        setErro('Senha incorreta.');
      } else if (err.code === 'auth/invalid-email') {
        setErro('E-mail inválido.');
      } else {
        setErro('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#111] p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-3xl font-extrabold text-center">
          LOGIN<span className="text-blue-500">.</span>
        </h2>

        {erro && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {erro}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-semibold">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@exemplo.com"
            className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="senha" className="block mb-1 text-sm font-semibold">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition ${
            carregando ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="text-center text-sm mt-6 text-blue-300 hover:underline">
          <Link to="/cadastro">Não tem uma conta? Cadastre-se</Link>
        </div>
      </form>
    </div>
  );
}
