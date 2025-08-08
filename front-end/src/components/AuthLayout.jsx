import React from 'react';
export default function AuthLayout({ title, children }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-100 to-red-300 px-4">
      <form className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">{title}</h2>
        {children}
      </form>
    </div>
  );
}
