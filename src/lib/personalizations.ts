import type { PersonalizationKey, PersonalizationOptions, PersonalizationOption } from '@/store/useAppStore';

export type PersonalizationDisplay = PersonalizationOption & {
  priceKey: 'proteinUpgradePer' | 'duplicateDishPer' | 'additionalTimePer' | 'decorationCost';
  perGuest: boolean;
};

const FALLBACK_PERSONALIZATIONS: Record<PersonalizationKey, PersonalizationDisplay> = {
  proteinUpgrade: {
    key: 'proteinUpgrade',
    name: 'Troca de proteína',
    description: 'Eleve o prato principal com uma proteína premium alinhada ao menu escolhido.',
    value: 20,
    active: true,
    priceKey: 'proteinUpgradePer',
    perGuest: true,
  },
  duplicateDish: {
    key: 'duplicateDish',
    name: 'Prato duplicado',
    description: 'Inclua uma segunda opção em uma categoria do menu para ampliar a escolha dos convidados.',
    value: 30,
    active: true,
    priceKey: 'duplicateDishPer',
    perGuest: true,
  },
  additionalTime: {
    key: 'additionalTime',
    name: 'Tempo adicional',
    description: 'Estenda a presença da equipe para eventos com ritmo mais longo ou recepção prolongada.',
    value: 50,
    active: true,
    priceKey: 'additionalTimePer',
    perGuest: true,
  },
  decoration: {
    key: 'decoration',
    name: 'Decoração',
    description: 'Toque final na mesa e apresentação dos pratos.',
    value: 250,
    active: true,
    priceKey: 'decorationCost',
    perGuest: false,
  },
};

export function getPersonalizationDisplay(
  key: PersonalizationKey,
  options: PersonalizationOptions
): PersonalizationDisplay {
  const fallback = FALLBACK_PERSONALIZATIONS[key];
  const option = options[key];

  return {
    ...fallback,
    ...option,
    priceKey: fallback.priceKey,
    perGuest: fallback.perGuest,
  };
}

export function getAllPersonalizationDisplays(options: PersonalizationOptions) {
  return (Object.keys(FALLBACK_PERSONALIZATIONS) as PersonalizationKey[]).map((key) =>
    getPersonalizationDisplay(key, options)
  );
}
