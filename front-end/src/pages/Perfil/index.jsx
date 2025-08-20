import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [novoEmail, setNovoEmail] = useState("");
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, "usuarios", user.uid)).then((snap) => {
        if (snap.exists()) {
          const dados = snap.data();
          setUsuario({ uid: user.uid, ...dados, email: user.email });
          setNovoEmail(user.email);
          if (dados.fotoURL) {
            setPreviewFoto(dados.fotoURL);
          }
        }
      });
    }
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const salvarAlteracoes = async () => {
    if (!usuario) return;
    setSalvando(true);

    try {
      let fotoURL = usuario.fotoURL || "";

      if (foto) {
        const fotoRef = ref(storage, `usuarios/${usuario.uid}/perfil.jpg`);
        await uploadBytes(fotoRef, foto);
        fotoURL = await getDownloadURL(fotoRef);
      }

      if (novoEmail && novoEmail !== usuario.email) {
        await updateEmail(auth.currentUser, novoEmail);
      }

      await updateDoc(doc(db, "usuarios", usuario.uid), {
        fotoURL,
        email: novoEmail,
      });

      setUsuario((prev) => ({ ...prev, fotoURL, email: novoEmail }));
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-lg mx-auto bg-[#1e293b] p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

        <div className="flex flex-col items-center mb-4">
          <img
            src={previewFoto || "https://via.placeholder.com/120"}
            alt="Foto de perfil"
            className="w-28 h-28 rounded-full object-cover mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="text-sm"
          />
        </div>

        <div className="space-y-3">
          <p>
            <span className="font-semibold">Nome:</span> {usuario.nome || "—"}
          </p>

          <div>
            <label className="font-semibold block">Email:</label>
            <input
              type="email"
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#0f172a] border border-gray-600"
            />
          </div>

          <p>
            <span className="font-semibold">Telefone:</span>{" "}
            {usuario.telefone || "—"}
          </p>
          <p>
            <span className="font-semibold">CPF:</span> {usuario.cpf || "—"}
          </p>
          <p>
            <span className="font-semibold">Data de Nascimento:</span>{" "}
            {usuario.dataNascimento || "—"}
          </p>
        </div>

        <button
          onClick={salvarAlteracoes}
          disabled={salvando}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
