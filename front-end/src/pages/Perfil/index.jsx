import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, "usuarios", user.uid)).then((snap) => {
        if (snap.exists()) {
          setUsuario({ uid: user.uid, ...snap.data(), email: user.email });
        } else {
          setUsuario({ uid: user.uid, email: user.email });
        }
      });
    }
  }, []);

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
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Nome:</span> {usuario.nome || "—"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {usuario.email}
          </p>
          <p>
            <span className="font-semibold">UID:</span> {usuario.uid}
          </p>
        </div>
      </div>
    </div>
  );
}
