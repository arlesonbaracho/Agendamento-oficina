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
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, 'usuarios', user.uid)).then((snap) => {
        if (snap.exists()) setUsuario({ uid: user.uid, ...snap.data() });
      });
    }
  }, []);

  // Gera horários válidos com base no dia da semana
  const gerarHorarios = (dataSelecionada) => {
    if (!dataSelecionada) return;
    const diaSemana = new Date(dataSelecionada).getDay(); // 0 = domingo, 6 = sábado

    let inicio = 8;
    let fim = diaSemana === 6 ? 13 : 16; // sábado até 13h, outros até 16h
    let horarios = [];

    for (let h = inicio; h <= fim; h++) {
      horarios.push(`${String(h).padStart(2, '0')}:00`);
    }
    setHorariosDisponiveis(horarios);
  };

  const handleAgendar = async (e) => {
    e.preventDefault();

    // Se for "Outros", descrição é obrigatória
    if (servico === 'Outros' && !observacoes.trim()) {
      setMensagem('A descrição é obrigatória para o serviço "Outros".');
      return;
    }

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
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Data *</label>
          <input
            type="date"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
              gerarHorarios(e.target.value);
              setHora('');
            }}
            className="w-full p-2 rounded bg-[#1e293b] border border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Hora *</label>
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full p-2 rounded bg-[#1e293b] border border-gray-700 text-white"
            required
            disabled={!horariosDisponiveis.length}
          >
            <option value="">Selecione</option>
            {horariosDisponiveis.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Observações {servico === 'Outros' && '*'}
          </label>
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
