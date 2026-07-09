'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { saveLead } from '@/lib/chefdesk';

const schema = z.object({
  name: z.string().refine((val) => val.trim().split(' ').length >= 2, {
    message: 'Por favor, insira nome e sobrenome',
  }),
  phone: z.string().refine((val) => val.replace(/\D/g, '').length === 11, {
    message: 'Insira um celular válido com DDD',
  }),
  lgpd: z.boolean().refine((val) => val === true, {
    message: 'O consentimento é obrigatório',
  }),
});

const applyPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function Step1_1_Name() {
  const { lead, setLead, setIsNextEnabled } = useAppStore();
  
  const { register, watch, setValue, formState: { isValid, errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: lead.name,
      phone: lead.phone ? applyPhoneMask(lead.phone) : '',
      lgpd: false,
    },
  });

  const name = watch('name');
  const phone = watch('phone');
  const lgpd = watch('lgpd');

  // Track ref for unmount save
  const dataRef = useRef({ name, phone, isValid });
  useEffect(() => {
    dataRef.current = { name, phone, isValid };
  }, [name, phone, isValid]);

  useEffect(() => {
    setIsNextEnabled(isValid);
  }, [isValid, setIsNextEnabled]);

  useEffect(() => {
    if (name || phone) {
      setLead({
        name: name || '',
        phone: (phone || '').replace(/\D/g, ''),
      });
    }
  }, [name, phone, setLead]);

  useEffect(() => {
    return () => {
      const current = dataRef.current;
      if (current.isValid && current.name && current.phone) {
        saveLead(current.name, current.phone.replace(/\D/g, ''))
          .then((res) => {
            console.log('Lead saved successfully:', res);
          })
          .catch((err) => {
            console.error('Failed to save lead:', err);
          });
      }
    };
  }, []);

  return (
    <div className="w-full">
      <ChefMessage message="Olá, eu sou o Chef Lucas Medeiros e vou te acompanhar na criação do seu evento. Para começarmos, como posso te chamar?" />
      
      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-brand-light uppercase tracking-wider">Seu Nome Completo</label>
          <input 
            {...register('name')}
            type="text" 
            placeholder="Digite seu nome e sobrenome..."
            className="w-full bg-white border-2 border-brand-dark p-4 text-xl text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
          />
          {errors.name && (
            <span className="text-red-500 text-sm font-medium">{errors.name.message}</span>
          )}
        </div>

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

        <div className="flex items-start gap-3 mt-2">
          <input 
            {...register('lgpd')}
            type="checkbox" 
            id="lgpd"
            className="mt-1 w-5 h-5 accent-brand-primary shrink-0"
          />
          <label htmlFor="lgpd" className="text-sm text-brand-light font-semibold leading-tight cursor-pointer select-none">
            Concordo em compartilhar meus dados para receber o orçamento do meu evento por WhatsApp.
          </label>
        </div>
        {errors.lgpd && (
          <span className="text-red-500 text-sm font-medium -mt-2">{errors.lgpd.message}</span>
        )}
      </div>
    </div>
  );
}
