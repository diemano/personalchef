'use client';

import { useEffect, useState } from 'react';
import { Megaphone, Save, ShieldAlert, Sparkles } from 'lucide-react';
import { getMarketingOptions, updateMarketingOptions, MarketingOptions } from '@/lib/admin-api';
import { useToast } from '@/components/ui/Toast';

export default function MarketingPage() {
  const [options, setOptions] = useState<MarketingOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [pixelId, setPixelId] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [ga4Id, setGa4Id] = useState('');

  const { toast, error: toastError } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getMarketingOptions();
        setOptions(data);
        setPixelId(data.facebookPixelId || '');
        setGtmId(data.googleTagManagerId || '');
        setGa4Id(data.googleAnalyticsId || '');
      } catch (error) {
        console.error(error);
        toastError('Não foi possível carregar as configurações de marketing.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [toastError]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!options) return;

    try {
      setSaving(true);
      await updateMarketingOptions(options.id, {
        facebookPixelId: pixelId.trim(),
        googleTagManagerId: gtmId.trim(),
        googleAnalyticsId: ga4Id.trim(),
      });

      toast('Configurações de marketing salvas com sucesso.');
    } catch (error) {
      console.error(error);
      toastError('Não foi possível salvar as configurações.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider animate-pulse">
          Carregando configurações de marketing...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl font-black text-brand-primary">Configurações de Marketing</h1>
        <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider">
          Gerenciamento de scripts de rastreamento e conversão
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-brand-primary/10 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-primary/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
            <Megaphone size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-primary">Métricas e Integrações</h3>
            <p className="text-xs text-brand-primary/55 font-semibold">Os IDs inseridos abaixo serão integrados às páginas do cliente.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Facebook Pixel */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-primary/60">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              placeholder="Ex: 123456789012345"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              className="w-full rounded-xl border border-brand-primary/10 bg-white p-3 font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
            />
          </div>

          {/* Google Tag Manager */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-primary/60">
              Google Tag Manager ID
            </label>
            <input
              type="text"
              placeholder="Ex: GTM-XXXXXX"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              className="w-full rounded-xl border border-brand-primary/10 bg-white p-3 font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
            />
          </div>

          {/* Google Analytics 4 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-primary/60">
              Google Analytics (GA4) ID
            </label>
            <input
              type="text"
              placeholder="Ex: G-XXXXXXXXXX"
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value)}
              className="w-full rounded-xl border border-brand-primary/10 bg-white p-3 font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 bg-brand-primary/[0.02] border border-brand-primary/10 p-4 rounded-xl">
          <ShieldAlert className="text-brand-primary/50 shrink-0 mt-0.5" size={16} />
          <p className="text-xs font-semibold text-brand-primary/70 leading-relaxed">
            Certifique-se de que os IDs estão no formato correto. Estes scripts são injetados automaticamente no cabeçalho e corpo das páginas visitadas pelos usuários para rastreamento de conversão.
          </p>
        </div>

        <div className="flex justify-end pt-2 border-t border-brand-primary/10">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-black uppercase tracking-wider text-brand-light hover:bg-brand-primary/95 transition active:scale-95 shadow cursor-pointer disabled:opacity-55"
          >
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
