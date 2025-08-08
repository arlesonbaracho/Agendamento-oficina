import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import auth from '@/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/'); // redireciona para a home após login
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setErro('E-mail inválido');
      } else if (error.code === 'auth/user-not-found') {
        setErro('Usuário não encontrado');
      } else if (error.code === 'auth/wrong-password') {
        setErro('Senha incorreta');
      } else {
        setErro('Erro ao fazer login');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#111] p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-3xl font-extrabold text-white">
          FAÇA SEU LOGIN<span className="text-blue-500">.</span>
        </h2>

        {erro && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {erro}
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-semibold text-white">Email</label>
          <input
            type="email"
            value={email}
            placeholder="email@dominio.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-white">Senha</label>
          <div className="relative">
            <input
              type={verSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setVerSenha(!verSenha)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:underline"
            >
              {verSenha ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        <div className="text-right text-sm text-blue-300 hover:underline">
          <p >
            <a href="/esqueci-senha">Esqueci minha senha</a>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Entrar
        </button>

        <div className="text-center text-sm mt-6 text-blue-300 hover:underline">
          <a href="./cadastro">Criar Conta</a>
        </div>

      </form>
    </div>
  );

}