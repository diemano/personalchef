'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';

const schema = z.object({
  phone: z.string().refine((val) => val.replace(/\D/g, '').length === 11, {
    message: 'Insira um celular válido com DDD',
  }),
  lgpd: z.boolean().refine(val => val === true, {
    message: 'O consentimento é obrigatório'
  })
});

const applyPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function Step1_2_Contact() {
  const { lead, setLead, setIsNextEnabled } = useAppStore();
  
  const { register, watch, setValue, formState: { isValid, errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      phone: lead.phone,
      lgpd: false
    }
  });

  const phone = watch('phone');

  useEffect(() => {
    setIsNextEnabled(isValid);
  }, [isValid, setIsNextEnabled]);

  useEffect(() => {
    setLead({ name: lead.name, phone: phone.replace(/\D/g, '') });
  }, [phone, setLead, lead.name]);

  return (
    <div className="w-full">
      <ChefMessage message={`Prazer, ${lead.name.split(' ')[0]}. Caso você saia desta página, qual é o seu WhatsApp?`} />
      
      <div className="mt-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Seu WhatsApp</label>
          <input 
            {...register('phone')}
            type="tel" 
            placeholder="(99) 99999-9999"
            onChange={(e) => {
              const masked = applyPhoneMask(e.target.value);
              setValue('phone', masked, { shouldValidate: true });
            }}
            className="w-full bg-white border-2 border-brand-dark p-4 text-xl text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm font-medium">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input 
            {...register('lgpd')}
            type="checkbox" 
            id="lgpd"
            className="mt-1 w-5 h-5 accent-brand-primary"
          />
          <label htmlFor="lgpd" className="text-sm text-brand-light font-semibold leading-tight">
            [Consentimento LGPD] Aceito que meus dados sejam processados para fins de orçamento.
          </label>
        </div>
        {errors.lgpd && (
          <span className="text-red-500 text-sm font-medium -mt-4">{errors.lgpd.message}</span>
        )}
      </div>
    </div>
  );
}
