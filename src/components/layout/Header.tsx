import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';

export default function Header() {
  const getEtapa = useAppStore((state) => state.getEtapa);
  const etapa = getEtapa();
  const totalEtapas = 8;
  const progress = (etapa / totalEtapas) * 100;

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-light border-b border-brand-primary/10 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Image
            src="/logo-azul1.png"
            alt="Chef Lucas Medeiros Logo"
            width={2193}
            height={2134}
            className="h-10 w-auto object-contain"
          />
          <span className="font-serif font-semibold text-brand-primary text-sm md:text-lg">
            Chef Lucas Medeiros
          </span>
        </div>
        <div className="text-[10px] md:text-sm font-bold text-brand-primary/80 uppercase tracking-tighter">
          Etapa {etapa} de {totalEtapas}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full h-1 bg-brand-primary/10">
        <div 
          className="h-full bg-brand-secondary transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
