import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 px-6">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold">Oficina XYZ</Link>
        <div className="space-x-4">
          <Link to="/">Início</Link>
          <Link to="/agendamento">Agendamento</Link>
        </div>
      </nav>
    </header>
  );
}
