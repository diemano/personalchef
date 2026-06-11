import { useEffect, useState } from 'react';
import {
  ChefdeskMenuOptions,
  ChefdeskSiteOptions,
  getMenuOptions,
  getPersonalizationOptions,
  getSiteOptions,
} from '@/lib/chefdesk';
import type { PersonalizationKey, PersonalizationOptions, PricingConfig } from '@/store/useAppStore';
import type { MenuCategory } from '@/store/useAppStore';
import { useAppStore } from '@/store/useAppStore';

let cachedMenuOptions: ChefdeskMenuOptions | undefined;
let cachedSiteOptions: ChefdeskSiteOptions | undefined;

const PERSONALIZATION_PRICE_KEYS: Record<PersonalizationKey, keyof PricingConfig> = {
  proteinUpgrade: 'proteinUpgradePer',
  duplicateDish: 'duplicateDishPer',
  additionalTime: 'additionalTimePer',
  decoration: 'decorationCost',
};

function applyPersonalizationPricing(pricing: ChefdeskSiteOptions['pricing'], personalizations: PersonalizationOptions) {
  const nextPricing = { ...pricing };

  (Object.keys(personalizations) as PersonalizationKey[]).forEach((key) => {
    const option = personalizations[key];

    if (option) {
      nextPricing[PERSONALIZATION_PRICE_KEYS[key]] = option.value;
    }
  });

  return nextPricing;
}

function clearUnavailablePersonalizations(options: ChefdeskSiteOptions) {
  const { event, upsell, setEvent, setUpsell } = useAppStore.getState();
  const activeOptions = options.upsellOptions;
  const upsellReset: Partial<typeof upsell> = {};

  if (!activeOptions.includes('decoration') && event.hasDecoration) {
    setEvent({ hasDecoration: false });
  }

  if (!activeOptions.includes('proteinUpgrade') && upsell.proteinUpgrade) {
    upsellReset.proteinUpgrade = false;
  }

  if (!activeOptions.includes('duplicateDish') && upsell.duplicateDish) {
    upsellReset.duplicateDish = false;
  }

  if (!activeOptions.includes('additionalTime') && upsell.additionalTime) {
    upsellReset.additionalTime = false;
  }

  if (Object.keys(upsellReset).length > 0) {
    setUpsell(upsellReset);
  }
}

function clearUnavailableMenuSelections(options: ChefdeskMenuOptions) {
  const { menu, setMenuSelection } = useAppStore.getState();

  (Object.keys(menu) as MenuCategory[]).forEach((category) => {
    const dishId = menu[category];
    const isAvailable = dishId ? options[category]?.dishes.some((dish) => dish.id === dishId) : true;

    if (dishId && !isAvailable) {
      setMenuSelection(category, '');
    }
  });
}

export function useChefdeskMenuOptions(fallback: ChefdeskMenuOptions) {
  const [menuOptions, setMenuOptions] = useState<ChefdeskMenuOptions>(cachedMenuOptions ?? fallback);
  const [isLoading, setIsLoading] = useState(!cachedMenuOptions);

  useEffect(() => {
    let isActive = true;

    getMenuOptions()
      .then((options) => {
        cachedMenuOptions = options;

        if (isActive) {
          setMenuOptions(options);
          clearUnavailableMenuSelections(options);
        }
      })
      .catch((error) => {
        console.error('Falha ao carregar pratos ChefDesk:', error);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { menuOptions, isLoading };
}

export function useChefdeskSiteOptions() {
  const [options, setOptions] = useState<ChefdeskSiteOptions | undefined>(cachedSiteOptions);
  const [isLoading, setIsLoading] = useState(!cachedSiteOptions);
  const setPricing = useAppStore((state) => state.setPricing);
  const setPersonalizationOptions = useAppStore((state) => state.setPersonalizationOptions);

  useEffect(() => {
    if (cachedSiteOptions) {
      setPricing(cachedSiteOptions.pricing);
    }

    let isActive = true;

    async function loadSiteOptions() {
      const siteOptions = await getSiteOptions();
      let resolvedOptions = siteOptions;
      let personalizations: PersonalizationOptions = {};

      try {
        personalizations = await getPersonalizationOptions();
        const activePersonalizationKeys = Object.values(personalizations)
          .filter((option) => option.active)
          .map((option) => option.key);

        resolvedOptions = {
          ...siteOptions,
          pricing: applyPersonalizationPricing(siteOptions.pricing, personalizations),
          upsellOptions: activePersonalizationKeys,
        };
      } catch (error) {
        console.error('Falha ao carregar personalizacoes ativas ChefDesk:', error);
      }

      return { siteOptions: resolvedOptions, personalizations };
    }

    loadSiteOptions()
      .then(({ siteOptions, personalizations }) => {
        if (!isActive) return;

        cachedSiteOptions = siteOptions;
        setOptions(siteOptions);
        setPersonalizationOptions(personalizations);

        if (siteOptions?.pricing) {
          setPricing(siteOptions.pricing);
        }

        clearUnavailablePersonalizations(siteOptions);
      })
      .catch((error) => {
        console.error('Falha ao carregar opcoes ChefDesk:', error);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [setPersonalizationOptions, setPricing]);

  return { options, isLoading };
}
