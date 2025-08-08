import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function PrivateRoute({ children }) {
  const [usuario, setUsuario] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

  if (usuario === undefined) {
    return <div className="text-center mt-20">Carregando...</div>;
  }

  return usuario ? children : <Navigate to="/login" />;
}

