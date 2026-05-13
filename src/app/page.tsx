'use client';

import { useAppStore } from '@/store/useAppStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomSheet from '@/components/layout/BottomSheet';
import StepTransition from '@/components/layout/StepTransition';
import { useAutosave } from '@/hooks/useAutosave';

// Steps
import Step1_1_Name from '@/components/steps/Step1_1_Name';
import Step1_2_Contact from '@/components/steps/Step1_2_Contact';
import Step2_1_Menu from '@/components/steps/Step2_1_Menu';
import Step2_2_Inclusos from '@/components/steps/Step2_2_Inclusos';
import Step2_3_Costs from '@/components/steps/Step2_3_Costs';
import Step3_1_DateShift from '@/components/steps/Step3_1_DateShift';
import Step3_2_Local from '@/components/steps/Step3_2_Local';
import Step3_3_Convidados from '@/components/steps/Step3_3_Convidados';
import Step3_4_Ocasion from '@/components/steps/Step3_4_Ocasion';
import Step4_1_Kitchen from '@/components/steps/Step4_1_Kitchen';
import Step4_2_Decoration from '@/components/steps/Step4_2_Decoration';
import Step4_3_Waiters from '@/components/steps/Step4_3_Waiters';
import Step5_1_Dietary from '@/components/steps/Step5_1_Dietary';
import Step6MenuSelection from '@/components/steps/Step6_MenuSelection';

export default function Home() {
  const currentStep = useAppStore((state) => state.currentStep);
  
  // Enable autosave simulation globally
  useAutosave();

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden selection:bg-brand-secondary/30">
      <Header />
      
      <main className="flex-1 flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-8 pb-40">
        <StepTransition stepKey={currentStep}>
          <div className="w-full flex-1">
            {currentStep === 1 && <Step1_1_Name />}
            {currentStep === 2 && <Step1_2_Contact />}
            {currentStep === 3 && <Step2_1_Menu />}
            {currentStep === 4 && <Step2_2_Inclusos />}
            {currentStep === 5 && <Step2_3_Costs />}
            {currentStep === 6 && <Step3_1_DateShift />}
            {currentStep === 7 && <Step3_2_Local />}
            {currentStep === 8 && <Step3_3_Convidados />}
            {currentStep === 9 && <Step3_4_Ocasion />}
            {currentStep === 10 && <Step4_1_Kitchen />}
            {currentStep === 11 && <Step4_2_Decoration />}
            {currentStep === 12 && <Step4_3_Waiters />}
            {currentStep === 13 && <Step5_1_Dietary />}
            {currentStep === 14 && <Step6MenuSelection category="coldStarter" />}
            {currentStep === 15 && <Step6MenuSelection category="hotStarter" />}
            {currentStep === 16 && <Step6MenuSelection category="mainCourse" />}
            {currentStep === 17 && <Step6MenuSelection category="dessert" />}
            
            {/* Placeholder for future steps */}
            {currentStep > 17 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h2 className="text-2xl font-serif text-brand-primary mb-4">
                  Passo {currentStep}
                </h2>
                <p className="text-brand-primary/70">
                  Conteúdo da etapa será implementado nas próximas fases.
                </p>
              </div>
            )}
          </div>
        </StepTransition>
      </main>

      <BottomSheet />
      <Footer />
    </div>
  );
}
