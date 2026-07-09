'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';
import ChefMessage from '@/components/chat/ChefMessage';
import { ChefHat, UtensilsCrossed, Star, Play, X } from 'lucide-react';

export default function Step2_2_Inclusos() {
  const { setIsNextEnabled } = useAppStore();
  const { options } = useChefdeskSiteOptions();
  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = options?.conceptVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-kitchen-professional-service-41662-large.mp4';
  const avatarUrl = options?.chefAvatarUrl || '/chef-lucas-avatar.jpg';
  const chefTitle = options?.chefTitle || 'Chef Lucas Medeiros';

  useEffect(() => {
    setIsNextEnabled(true);
  }, [setIsNextEnabled]);

  const items = [
    { label: 'Execução no local por Chef Profissional', icon: <ChefHat className="text-brand-secondary" /> },
    { label: 'Serviço de empratamento e apresentação', icon: <UtensilsCrossed className="text-brand-secondary" /> },
    { label: 'Organização e limpeza da cozinha ao final', icon: <Star className="text-brand-secondary" /> },
  ];

  return (
    <div className="w-full">
      <ChefMessage message="Oferecemos experiências gastronômicas de alto padrão, intimistas no conforto da sua casa. Levamos toda a estrutura necessária, realizamos a montagem da mesa, finalizamos os pratos diante dos seus convidados e, ao final do evento, deixamos tudo organizado." />
      
      {/* Video Section (Optional) */}
      <div className="mt-6">
        {!isPlaying ? (
          <div 
            onClick={() => setIsPlaying(true)}
            className="relative cursor-pointer w-full h-48 rounded-xl border-2 border-brand-dark overflow-hidden shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] bg-brand-primary/10 group"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
            <img 
              src={avatarUrl} 
              alt={chefTitle} 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-light">
              <div className="w-14 h-14 rounded-full bg-brand-secondary text-brand-dark flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 fill-brand-dark ml-1" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider bg-brand-dark/80 px-3 py-1 rounded-full">
                Assistir Apresentação (Opcional)
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-48 rounded-xl border-2 border-brand-dark overflow-hidden shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] bg-black">
            <video 
              src={videoUrl} 
              controls 
              autoPlay
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => setIsPlaying(false)}
              className="absolute top-2 right-2 bg-brand-dark/80 text-brand-light p-1 rounded-full hover:bg-brand-dark"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white border-2 border-brand-dark p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <span className="text-lg font-bold text-brand-dark">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
