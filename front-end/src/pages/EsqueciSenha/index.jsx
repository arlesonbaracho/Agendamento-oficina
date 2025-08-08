import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';


export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleEnviar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (!email) {
      setErro('Informe seu e-mail');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem('E-mail de recuperação enviado!');
    } catch (err) {
      console.error(err);
      setErro('Erro ao enviar e-mail. Verifique o endereço.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <form
        onSubmit={handleEnviar}
        className="bg-[#111] p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          RECUPERAR SENHA<span className="text-blue-500">.</span>
        </h2>

        {mensagem && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm">
            {mensagem}
          </div>
        )}
        {erro && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {erro}
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-semibold text-white">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            placeholder="email@dominio.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Enviar e-mail de recuperação
        </button>

        <div className="text-center text-sm mt-6 text-blue-300 hover:underline">
          <a href="/login">Voltar ao Login</a>
        </div>
      </form>
    </div>
  );

}
