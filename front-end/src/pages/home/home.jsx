import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserMenu from '../../components/UserMenu';

export default function Home() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  const imagens = ['/img/img-1.jpg', '/img/img-2.webp'];

  const atracoes = [
    {
      titulo: 'Troca de Óleo',
      descricao: 'Serviço rápido e eficiente.',
      imagem: '/img/img-1.jpg'
    },
    {
      titulo: 'Alinhamento',
      descricao: 'Dirija com mais segurança.',
      imagem: '/img/img-2.webp'
    },
    {
      titulo: 'Freios',
      descricao: 'Segurança é prioridade.',
      imagem: '/img/img-3.jpg'
    },
    {
      titulo: 'Suspensão',
      descricao: 'Conforto e estabilidade.',
      imagem: '/img/img-4.jpg'
    }
  ];


  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, 'usuarios', user.uid)).then((snap) => {
        if (snap.exists())
          setUsuario({ uid: user.uid, ...snap.data(), photoURL: user.photoURL });
        else
          setUsuario({ uid: user.uid, photoURL: user.photoURL });
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30 bg-black/30 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/img/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Oficina X</span>
        </div>
        <UserMenu avatarSrc={usuario?.photoURL || '/img/avatar.jpg'} />
      </header>

      {/* Hero Slider Fullscreen */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 5000 }}
        loop
        className="h-screen"
      >
        {imagens.map((src, idx) => (
          <SwiperSlide key={idx} className="relative">
            <img
              src={src}
              alt={`Banner ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay de conteúdo */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-4 sm:px-12 md:px-20 space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
                Experience Alps<br />from a new perspective
              </h1>
              <p className="max-w-xs sm:max-w-md text-xs sm:text-lg">
                Explore trilhas incríveis e aventuras inesquecíveis nas montanhas.
              </p>
              <button
                onClick={() => navigate('/agendamento')}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base transition"
              >
                Agendar Horário
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Carrossel após o banner principal - todas as telas */}
      <div className="w-full px-4 mt-6 pb-6">
        <Swiper
          modules={[Navigation]}
          slidesPerView={1.2}
          spaceBetween={20}
          navigation
          breakpoints={{
            480: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {atracoes.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  src={item.imagem}
                  alt={item.titulo}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-black">{item.titulo}</h3>
                  <p className="text-sm text-gray-700">
                    {item.descricao}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>


    </div>
  );
}
