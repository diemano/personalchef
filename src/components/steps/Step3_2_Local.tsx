'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { Home, Building2, MapPin, Tent } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  city: z.string().min(3, 'Cidade é obrigatória'),
  neighborhood: z.string().min(3, 'Bairro é obrigatório'),
  locationType: z.enum(['house', 'apartment', 'event_space', 'other']).optional().refine(Boolean, {
    message: 'Selecione o tipo de local',
  }),
});

export default function Step3_2_Local() {
  const { event, setEvent, setIsNextEnabled } = useAppStore();
  
  const { register, watch, setValue, formState: { isValid, errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      city: event.city || '',
      neighborhood: event.neighborhood || '',
      locationType: event.locationType,
    }
  });

  const city = watch('city');
  const neighborhood = watch('neighborhood');
  const locationType = watch('locationType');

  useEffect(() => {
    setIsNextEnabled(isValid);
  }, [isValid, setIsNextEnabled]);

  useEffect(() => {
    setEvent({ city, neighborhood, locationType });
  }, [city, neighborhood, locationType, setEvent]);

  const locationTypes = [
    { id: 'house', label: 'Casa', icon: <Home size={20} /> },
    { id: 'apartment', label: 'Apartamento', icon: <Building2 size={20} /> },
    { id: 'event_space', label: 'Espaço de Eventos', icon: <Tent size={20} /> },
    { id: 'other', label: 'Outro', icon: <MapPin size={20} /> },
  ] as const;

  return (
    <div className="w-full">
      <ChefMessage message="Onde será realizado o evento? Atendemos em diversas regiões." />
      
      <div className="mt-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Cidade</label>
            <input 
              {...register('city')}
              type="text" 
              placeholder="Ex: São Paulo"
              className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
            />
            {errors.city && <span className="text-red-500 text-xs font-bold">{errors.city.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Bairro</label>
            <input 
              {...register('neighborhood')}
              type="text" 
              placeholder="Ex: Jardins"
              className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
            />
            {errors.neighborhood && <span className="text-red-500 text-xs font-bold">{errors.neighborhood.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Tipo de Local</label>
          <div className="grid grid-cols-2 gap-3">
            {locationTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setValue('locationType', type.id, { shouldValidate: true })}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 border-brand-dark transition-all text-left",
                  locationType === type.id 
                    ? "bg-brand-secondary text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]" 
                    : "bg-white text-brand-primary hover:bg-brand-secondary/25 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  locationType === type.id ? "bg-brand-dark/10" : "bg-brand-primary/5"
                )}>
                  {type.icon}
                </div>
                <span className="font-bold text-sm leading-tight">{type.label}</span>
              </button>
            ))}
          </div>
          {errors.locationType && <span className="text-red-500 text-xs font-bold">{errors.locationType.message}</span>}
        </div>
      </div>
    </div>
  );
}
