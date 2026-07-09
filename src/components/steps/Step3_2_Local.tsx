'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';
import { Home, Building2, MapPin, Tent } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  locationType: z.enum(['house', 'apartment', 'event_space', 'other']).optional(),
  otherLocationText: z.string().optional(),
  isLocationNotDefined: z.boolean().default(false),
  occasion: z.string().min(1, 'Ocasião é obrigatória'),
  observations: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.isLocationNotDefined) {
    if (!data.city || data.city.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cidade é obrigatória (mínimo 3 caracteres)',
        path: ['city'],
      });
    }
    if (!data.neighborhood || data.neighborhood.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Bairro é obrigatório (mínimo 3 caracteres)',
        path: ['neighborhood'],
      });
    }
    if (!data.locationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o tipo de local',
        path: ['locationType'],
      });
    }
    if (data.locationType === 'other' && (!data.otherLocationText || data.otherLocationText.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Especifique o tipo de local',
        path: ['otherLocationText'],
      });
    }
  }
});

type LocalFormData = z.infer<typeof schema>;

export default function Step3_2_Local() {
  const { event, setEvent, setIsNextEnabled } = useAppStore();
  const { options } = useChefdeskSiteOptions();
  
  const { register, watch, setValue, formState: { isValid, errors } } = useForm<LocalFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      city: event.city || '',
      neighborhood: event.neighborhood || '',
      locationType: event.locationType,
      otherLocationText: event.otherLocationText || '',
      isLocationNotDefined: event.isLocationNotDefined || false,
      occasion: event.occasion || '',
      observations: event.observations || '',
    }
  });

  const city = watch('city');
  const neighborhood = watch('neighborhood');
  const locationType = watch('locationType');
  const otherLocationText = watch('otherLocationText');
  const isLocationNotDefined = watch('isLocationNotDefined');
  const occasion = watch('occasion');
  const observations = watch('observations');

  useEffect(() => {
    setIsNextEnabled(isValid);
  }, [isValid, setIsNextEnabled]);

  useEffect(() => {
    setEvent({
      city: isLocationNotDefined ? '' : city,
      neighborhood: isLocationNotDefined ? '' : neighborhood,
      locationType: isLocationNotDefined ? undefined : locationType,
      otherLocationText: isLocationNotDefined ? '' : otherLocationText,
      isLocationNotDefined,
      occasion,
      observations,
    });
  }, [city, neighborhood, locationType, otherLocationText, isLocationNotDefined, occasion, observations, setEvent]);

  const locationTypes = [
    { id: 'house', label: 'Casa', icon: <Home size={20} /> },
    { id: 'apartment', label: 'Apartamento', icon: <Building2 size={20} /> },
    { id: 'event_space', label: 'Espaço de Eventos', icon: <Tent size={20} /> },
    { id: 'other', label: 'Outro', icon: <MapPin size={20} /> },
  ] as const;

  const availableLocationTypes = options?.locationTypes?.length
    ? options.locationTypes.map((id) => locationTypes.find((type) => type.id === id) ?? {
        id: id as 'other',
        label: id,
        icon: <MapPin size={20} />,
      })
    : locationTypes;

  return (
    <div className="w-full">
      <ChefMessage message="Onde e em qual ocasião será realizado o seu evento? Se você não tiver o endereço definido ainda, não tem problema, pode marcar a opção correspondente." />
      
      <div className="mt-6 flex flex-col gap-6">
        
        {/* Ocasião (Sempre visível) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Qual o tipo de comemoração / ocasião?</label>
          <input 
            {...register('occasion')}
            type="text" 
            placeholder="Aniversário, casamento, noivado, batizado, confraternização, corporativo..."
            className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
          />
          {errors.occasion && <span className="text-red-500 text-xs font-bold">{errors.occasion.message}</span>}
        </div>

        {/* Checkbox Local não definido */}
        <div className="flex items-center gap-3 bg-brand-light/[0.05] border-2 border-brand-dark/20 p-4 rounded-xl">
          <input 
            {...register('isLocationNotDefined')}
            type="checkbox" 
            id="isLocationNotDefined"
            className="w-5 h-5 accent-brand-primary cursor-pointer shrink-0"
          />
          <label htmlFor="isLocationNotDefined" className="text-sm text-brand-light font-bold cursor-pointer select-none">
            Ainda não defini o local do evento (prosseguir sem endereço)
          </label>
        </div>

        {!isLocationNotDefined && (
          <>
            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Cidade</label>
                <input 
                  {...register('city')}
                  type="text" 
                  placeholder="Ex: João Pessoa"
                  className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
                />
                {errors.city && <span className="text-red-500 text-xs font-bold">{errors.city.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Bairro</label>
                <input 
                  {...register('neighborhood')}
                  type="text" 
                  placeholder="Ex: Manaíra"
                  className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
                />
                {errors.neighborhood && <span className="text-red-500 text-xs font-bold">{errors.neighborhood.message}</span>}
              </div>
            </div>

            {/* Tipo de Local */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Tipo de Local</label>
              <div className="grid grid-cols-2 gap-3">
                {availableLocationTypes.map((type) => (
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

            {/* Outro Tipo de Local */}
            {locationType === 'other' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Especifique o tipo de local</label>
                <input 
                  {...register('otherLocationText')}
                  type="text" 
                  placeholder="Ex: Barco, Chácara, Praia..."
                  className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
                />
                {errors.otherLocationText && <span className="text-red-500 text-xs font-bold">{errors.otherLocationText.message}</span>}
              </div>
            )}
          </>
        )}

        {/* Observações */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Observações do Local (Opcional)</label>
          <textarea 
            {...register('observations')}
            placeholder="Ex: A portaria necessita de autorização prévia, a cozinha fica no segundo andar, etc."
            rows={3}
            className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40 resize-none font-medium text-sm leading-relaxed"
          />
        </div>

      </div>
    </div>
  );
}
