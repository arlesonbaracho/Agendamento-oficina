import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function UserMenu({ avatarSrc }) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNome(docSnap.data().nome || user.displayName || 'Usuário');
        } else {
          setNome(user.displayName || 'Usuário');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div ref={ref} className="relative">
      <img
        src={avatarSrc || '/img/avatar.jpg'}
        alt="Avatar"
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-white shadow-md"
      />
      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded shadow-lg w-48 text-sm text-gray-800 z-50">
          <div className="px-4 py-3 border-b font-semibold text-center">
            {nome || 'Usuário'}
          </div>
          <button
            onClick={() => navigate('/perfil')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Perfil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
