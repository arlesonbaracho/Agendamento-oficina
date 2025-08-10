import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function validarSenhaRequisitos(senha) {
  return {
    minimo: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /[0-9]/.test(senha),
    simbolo: /[@$!%*?&._\-]/.test(senha),
  };
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState(''); // ✅ adicionado
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const requisitos = validarSenhaRequisitos(senha);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    if (!email || !senha || !nome || !telefone) {
      setErro('Preencha todos os campos.');
      setCarregando(false);
      return;
    }
    if (!emailValido(email)) {
      setErro('E-mail inválido.');
      setCarregando(false);
      return;
    }
    if (Object.values(requisitos).includes(false)) {
      setErro('A senha não atende aos requisitos de segurança.');
      setCarregando(false);
      return;
    }

    try {
      const credenciais = await createUserWithEmailAndPassword(auth, email, senha);

      await updateProfile(credenciais.user, {
        displayName: nome
      });

      await setDoc(doc(db, 'usuarios', credenciais.user.uid), {
        uid: credenciais.user.uid,
        nome,
        email,
        telefone,
        criadoEm: new Date(),
      });

      navigate('/login');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErro('Este e-mail já está em uso.');
      } else {
        setErro('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const força = Object.values(requisitos).filter(v => v).length;
  const forçaPercent = (força / 5) * 100;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <form
        onSubmit={handleCadastro}
        className="bg-[#111] p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-3xl font-extrabold text-center">
          CADASTRO<span className="text-blue-500">.</span>
        </h2>

        {erro && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {erro}
          </div>
        )}

        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block mb-1 text-sm font-semibold">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block mb-1 text-sm font-semibold">
            Telefone
          </label>
          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(99) 99999-9999"
            className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
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
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label htmlFor="senha" className="block mb-1 text-sm font-semibold">
            Senha
          </label>
          <div className="relative">
            <input
              id="senha"
              type={verSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 rounded border border-blue-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
              required
            />
            <button
              type="button"
              onClick={() => setVerSenha(!verSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:underline"
            >
              {verSenha ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        {/* Requisitos de senha */}
        <div className="text-sm mb-4 space-y-1">
          <p className={requisitos.minimo ? 'text-green-500' : 'text-red-500'}>
            {requisitos.minimo ? '✔' : '✖'} Mínimo 8 caracteres
          </p>
          <p className={requisitos.maiuscula ? 'text-green-500' : 'text-red-500'}>
            {requisitos.maiuscula ? '✔' : '✖'} Uma letra maiúscula
          </p>
          <p className={requisitos.minuscula ? 'text-green-500' : 'text-red-500'}>
            {requisitos.minuscula ? '✔' : '✖'} Uma letra minúscula
          </p>
          <p className={requisitos.numero ? 'text-green-500' : 'text-red-500'}>
            {requisitos.numero ? '✔' : '✖'} Um número
          </p>
          <p className={requisitos.simbolo ? 'text-green-500' : 'text-red-500'}>
            {requisitos.simbolo ? '✔' : '✖'} Um símbolo (@$!%*?&...)
          </p>
        </div>

        {/* Barra de força */}
        <div className="w-full bg-gray-700 rounded h-2 mb-4">
          <div
            className={`h-2 rounded ${força < 3 ? 'bg-red-500' : força < 5 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${forçaPercent}%` }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition ${carregando ? 'opacity-70 cursor-not-allowed' : ''
            }`}
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <div className="text-center text-sm mt-6 text-blue-300 hover:underline">
          <Link to="/login">Já tem uma conta? Entrar</Link>
        </div>
      </form>
    </div>
  );
}
