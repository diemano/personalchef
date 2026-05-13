'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfToday 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step3_1_DateShift() {
  const { event, setEvent, setIsNextEnabled } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const selectedDate = event.date ? new Date(event.date) : undefined;
  const today = startOfToday();

  useEffect(() => {
    setIsNextEnabled(!!event.date && !!event.shift);
  }, [event.date, event.shift, setIsNextEnabled]);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-2 mb-4">
        <span className="text-lg font-serif font-bold text-brand-primary capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-brand-primary" />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-brand-primary" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEEEE";
    const days = [];
    let startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-[10px] font-bold text-brand-primary uppercase">
          {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isDisabled = isBefore(day, today) || !isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-10 flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer transition-all",
              isDisabled ? "text-brand-primary/20 cursor-not-allowed" : "hover:bg-brand-secondary/20 text-brand-primary",
              isSelected && "bg-brand-dark text-brand-light hover:bg-brand-dark shadow-[2px_2px_0px_0px_rgba(201,168,106,1)]"
            )}
            onClick={() => !isDisabled && setEvent({ date: cloneDay.toISOString() })}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="flex flex-col gap-1">{rows}</div>;
  };

  return (
    <div className="w-full">
      <ChefMessage message="Para começarmos, qual é a data prevista para o seu evento?" />
      
      <div className="mt-6 bg-white border-2 border-brand-dark p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <div className="mt-8">
        <label className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4 block">Selecione o Turno</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setEvent({ shift: 'lunch' })}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-brand-dark transition-all shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]",
              event.shift === 'lunch' ? "bg-brand-secondary text-brand-dark" : "bg-white text-brand-primary hover:bg-brand-primary/5"
            )}
          >
            <Sun size={24} />
            <span className="font-serif font-bold">Almoço</span>
          </button>
          <button
            onClick={() => setEvent({ shift: 'dinner' })}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-brand-dark transition-all shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]",
              event.shift === 'dinner' ? "bg-brand-secondary text-brand-dark" : "bg-white text-brand-primary hover:bg-brand-primary/5"
            )}
          >
            <Moon size={24} />
            <span className="font-serif font-bold">Jantar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
