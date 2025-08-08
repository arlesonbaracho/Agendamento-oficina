// src/components/ProfileAvatar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileAvatar({ src }) {
  const navigate = useNavigate();
  return (
    <img
      src={src}
      alt="Avatar"
      onClick={() => navigate('/perfil')}
      className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-white shadow-md"
    />
  );
}
