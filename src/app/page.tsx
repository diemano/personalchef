'use client';

import { useAppStore } from '@/store/useAppStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomSheet from '@/components/layout/BottomSheet';
import StepTransition from '@/components/layout/StepTransition';

export default function Home() {
  const currentStep = useAppStore((state) => state.currentStep);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-8 pb-32">
        <StepTransition stepKey={currentStep}>
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            {/* Placeholder for future steps */}
            <h2 className="text-2xl font-serif text-brand-primary mb-4">
              Passo {currentStep}
            </h2>
            <p className="text-brand-primary/70 text-center">
              Conteúdo da etapa será implementado nas próximas fases.
            </p>
          </div>
        </StepTransition>
      </main>

      <BottomSheet />
      <Footer />
    </div>
  );
}
