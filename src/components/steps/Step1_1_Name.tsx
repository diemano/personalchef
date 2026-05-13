'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';

const schema = z.object({
  name: z.string().refine((val) => val.trim().split(' ').length >= 2, {
    message: 'Por favor, insira nome e sobrenome',
  }),
});

export default function Step1_1_Name() {
  const { lead, setLead, setIsNextEnabled } = useAppStore();
  
  const { register, watch, formState: { isValid, errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: lead.name
    }
  });

  const name = watch('name');

  useEffect(() => {
    setIsNextEnabled(isValid);
  }, [isValid, setIsNextEnabled]);

  useEffect(() => {
    if (isValid) {
      setLead({ name, phone: lead.phone });
    }
  }, [name, isValid, setLead, lead.phone]);

  return (
    <div className="w-full">
      <ChefMessage message="Olá, eu sou o Chef Lucas Medeiros. Com quem eu tenho o prazer de falar?" />
      
      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-bold text-brand-dark uppercase tracking-wider">Seu Nome</label>
        <input 
          {...register('name')}
          type="text" 
          placeholder="Digite seu nome completo aqui..."
          className="w-full bg-white border-2 border-brand-dark p-4 text-xl text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
        />
        {errors.name && (
          <span className="text-red-500 text-sm font-medium">{errors.name.message}</span>
        )}
      </div>
    </div>
  );
}
