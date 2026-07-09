'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Image as ImageIcon, Video, User, Type, Save, Loader2, RotateCcw, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getMediaOptions, updateMediaOptions, type MediaOptions } from '@/lib/admin-api';
import { compressImageToBase64 } from '@/lib/image';

type MediaField = 'chefTitle' | 'chefLogoUrl' | 'chefAvatarUrl' | 'conceptVideoUrl' | 'decorationImageUrl';

const DEFAULTS: Omit<MediaOptions, 'id'> = {
  chefTitle: 'Chef Lucas Medeiros',
  chefLogoUrl: '/logo-azul1.png',
  chefAvatarUrl: '/chef-lucas-avatar.jpg',
  conceptVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-kitchen-professional-service-41662-large.mp4',
  decorationImageUrl: '/decoracao_mesa.png',
};

/* ---- Compact image picker with Substituir / Remover buttons ---- */
function CompactImageField({
  label,
  value,
  defaultValue,
  onFileSelect,
  onRemove,
  shape = 'rect',
}: {
  label: string;
  value: string;
  defaultValue: string;
  onFileSelect: (file: File, previewUrl: string) => void;
  onRemove: () => void;
  shape?: 'rect' | 'circle';
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    const url = URL.createObjectURL(file);
    onFileSelect(file, url);
    if (inputRef.current) inputRef.current.value = '';
  }

  const isDefault = value === defaultValue;

  return (
    <div className="flex items-center gap-4">
      {/* Thumbnail */}
      <div
        className={`shrink-0 border border-brand-primary/10 bg-brand-primary/[0.03] overflow-hidden flex items-center justify-center ${
          shape === 'circle' ? 'w-14 h-14 rounded-full' : 'w-20 h-14 rounded-lg'
        }`}
      >
        <img
          src={value}
          alt={label}
          className={`object-cover ${shape === 'circle' ? 'w-full h-full' : 'h-full w-full object-contain p-1'}`}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary/70 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
        >
          <RefreshCw className="h-3 w-3" />
          Substituir
        </button>
        {!isDefault && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500/70 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
            Remover
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

export default function MidiasPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optionsId, setOptionsId] = useState('');
  const [formData, setFormData] = useState<Omit<MediaOptions, 'id'>>(DEFAULTS);
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMediaOptions();
      setOptionsId(data.id);
      setFormData({
        chefTitle: data.chefTitle,
        chefLogoUrl: data.chefLogoUrl,
        chefAvatarUrl: data.chefAvatarUrl,
        conceptVideoUrl: data.conceptVideoUrl,
        decorationImageUrl: data.decorationImageUrl,
      });
    } catch (err) {
      toastError('Erro ao carregar mídias.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleTextChange(field: MediaField, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileSelect(field: MediaField, file: File, previewUrl: string) {
    setImageFiles((prev) => ({ ...prev, [field]: file }));
    setFormData((prev) => ({ ...prev, [field]: previewUrl }));
  }

  function handleRemoveImage(field: MediaField) {
    setImageFiles((prev) => ({ ...prev, [field]: null }));
    setFormData((prev) => ({ ...prev, [field]: DEFAULTS[field] }));
  }

  async function handleSave() {
    if (!optionsId) {
      toastError('Nenhuma configuração encontrada. Verifique o backend.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<Omit<MediaOptions, 'id'>> = { ...formData };

      for (const [field, file] of Object.entries(imageFiles)) {
        if (file) {
          const base64 = await compressImageToBase64(file);
          (payload as Record<string, string>)[field] = base64;
        }
      }

      await updateMediaOptions(optionsId, payload);
      setImageFiles({});
      success('Mídias salvas com sucesso! As alterações já estão ativas no site.');
      await loadData();
    } catch (err) {
      toastError('Erro ao salvar mídias.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const confirmed = window.confirm('Deseja restaurar todos os campos para os valores padrão?');
    if (!confirmed) return;
    setFormData(DEFAULTS);
    setImageFiles({});
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-primary">Mídias</h1>
          <p className="mt-1 text-sm text-brand-primary/50">
            Gerencie o nome, logomarca, avatar do chef, vídeo de apresentação e imagem da decoração.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-primary/15 bg-white px-4 py-2.5 text-sm font-semibold text-brand-primary/60 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar Padrão
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-brand-light shadow-sm transition-all hover:bg-brand-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Form sections */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* ---- Nome do Chef / Site ---- */}
        <div className="rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/5">
              <Type className="h-4 w-4 text-brand-primary/50" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-brand-primary">Nome do Chef / Site</h2>
              <p className="text-[11px] text-brand-primary/40">Exibido no topo do site e nas mensagens do atendente.</p>
            </div>
          </div>
          <input
            type="text"
            value={formData.chefTitle}
            onChange={(e) => handleTextChange('chefTitle', e.target.value)}
            placeholder="Ex: Chef Lucas Medeiros"
            className="w-full rounded-xl border border-brand-primary/15 bg-white px-4 py-2.5 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
        </div>

        {/* ---- Link do Vídeo ---- */}
        <div className="rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/5">
              <Video className="h-4 w-4 text-brand-primary/50" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-brand-primary">Vídeo de Apresentação</h2>
              <p className="text-[11px] text-brand-primary/40">Link do vídeo (MP4) exibido na etapa de conceito.</p>
            </div>
          </div>
          <input
            type="url"
            value={formData.conceptVideoUrl}
            onChange={(e) => handleTextChange('conceptVideoUrl', e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-brand-primary/15 bg-white px-4 py-2.5 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
        </div>

        {/* ---- Logomarca ---- */}
        <div className="rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/5">
              <Sparkles className="h-4 w-4 text-brand-primary/50" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-brand-primary">Logomarca</h2>
              <p className="text-[11px] text-brand-primary/40">Imagem da logo exibida no cabeçalho do orçamento.</p>
            </div>
          </div>
          <CompactImageField
            label="Logomarca"
            value={formData.chefLogoUrl}
            defaultValue={DEFAULTS.chefLogoUrl}
            onFileSelect={(file, url) => handleFileSelect('chefLogoUrl', file, url)}
            onRemove={() => handleRemoveImage('chefLogoUrl')}
          />
        </div>

        {/* ---- Foto do Atendente ---- */}
        <div className="rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/5">
              <User className="h-4 w-4 text-brand-primary/50" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-brand-primary">Foto do Atendente</h2>
              <p className="text-[11px] text-brand-primary/40">Avatar exibido nos balões de mensagem e no vídeo.</p>
            </div>
          </div>
          <CompactImageField
            label="Avatar do Chef"
            value={formData.chefAvatarUrl}
            defaultValue={DEFAULTS.chefAvatarUrl}
            onFileSelect={(file, url) => handleFileSelect('chefAvatarUrl', file, url)}
            onRemove={() => handleRemoveImage('chefAvatarUrl')}
            shape="circle"
          />
        </div>

        {/* ---- Imagem Decoração ---- */}
        <div className="rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/5">
              <ImageIcon className="h-4 w-4 text-brand-primary/50" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-brand-primary">Imagem da Decoração</h2>
              <p className="text-[11px] text-brand-primary/40">Foto exibida na etapa de decoração do orçamento.</p>
            </div>
          </div>
          <CompactImageField
            label="Decoração"
            value={formData.decorationImageUrl}
            defaultValue={DEFAULTS.decorationImageUrl}
            onFileSelect={(file, url) => handleFileSelect('decorationImageUrl', file, url)}
            onRemove={() => handleRemoveImage('decorationImageUrl')}
          />
        </div>
      </div>
    </div>
  );
}
