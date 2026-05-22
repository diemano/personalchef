import { useEffect, useState } from 'react';
import {
  ChefdeskMenuOptions,
  ChefdeskSiteOptions,
  getMenuOptions,
  getSiteOptions,
} from '@/lib/chefdesk';
import { useAppStore } from '@/store/useAppStore';

let cachedMenuOptions: ChefdeskMenuOptions | undefined;
let cachedSiteOptions: ChefdeskSiteOptions | undefined;

export function useChefdeskMenuOptions(fallback: ChefdeskMenuOptions) {
  const [menuOptions, setMenuOptions] = useState<ChefdeskMenuOptions>(cachedMenuOptions ?? fallback);
  const [isLoading, setIsLoading] = useState(!cachedMenuOptions);

  useEffect(() => {
    if (cachedMenuOptions) return;

    let isActive = true;

    getMenuOptions()
      .then((options) => {
        cachedMenuOptions = options;

        if (isActive) {
          setMenuOptions(options);
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

  useEffect(() => {
    if (cachedSiteOptions) {
      setPricing(cachedSiteOptions.pricing);
      return;
    }

    let isActive = true;

    getSiteOptions()
      .then((siteOptions) => {
        if (!isActive) return;

        cachedSiteOptions = siteOptions;
        setOptions(siteOptions);

        if (siteOptions?.pricing) {
          setPricing(siteOptions.pricing);
        }
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
  }, [setPricing]);

  return { options, isLoading };
}
