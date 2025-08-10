import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import EsqueciSenha from '../pages/EsqueciSenha';
import Home from '../pages/home/home';
import PrivateRoute from '../components/PrivateRoute';
import Perfil from '../pages/Perfil';
import Agendamento from '../pages/Agendamento';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route
        path="/agendamento"
        element={
          <PrivateRoute>
            <Agendamento />
          </PrivateRoute>
        }
      />

    </Routes>

  );
}

