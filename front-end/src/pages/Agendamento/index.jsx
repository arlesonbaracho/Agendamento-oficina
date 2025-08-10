// src/pages/Agendamento/index.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Agendamento() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, 'usuarios', user.uid)).then((snap) => {
        if (snap.exists()) setUsuario({ uid: user.uid, ...snap.data() });
      });
    }
  }, []);

  const handleAgendar = async (e) => {
    e.preventDefault();
    if (!servico || !data || !hora) {
      setMensagem('Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'agendamentos'), {
        uid: usuario.uid,
        nome: usuario.nome,
        telefone: usuario.telefone,
        servico,
        data,
        hora,
        observacoes,
        criadoEm: serverTimestamp()
      });
      setMensagem('Agendamento realizado com sucesso!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMensagem('Erro ao agendar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return <div className="text-white text-center py-10">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Agendar Serviço</h1>

      <form
        onSubmit={handleAgendar}
        className="bg-[#111] p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <div>
          <label className="block mb-1">Serviço *</label>
          <select
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            className="w-full p-2 rounded bg-[#1e293b] border border-gray-700 text-white"
            required
          >
            <option value="">Selecione</option>
            <option value="Troca de Óleo">Troca de Óleo</option>
            <option value="Alinhamento">Alinhamento</option>
            <option value="Freios">Freios</option>
            <option value="Suspensão">Suspensão</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Data *</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-2 rounded bg-[#1e293b] border border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Hora *</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full p-2 rounded bg-[#1e293b] border border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full p-2 rounded bg-[#1e293b] border border-gray-700 text-white"
            rows="3"
          />
        </div>

        {mensagem && (
          <div className="text-center text-sm text-green-400">{mensagem}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Agendando...' : 'Agendar'}
        </button>
      </form>
    </div>
  );
}

