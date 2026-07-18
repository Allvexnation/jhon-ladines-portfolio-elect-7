import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeToggle } from '@/utils/ThemeToggle';
import { useLanguageToggle } from '@/utils/LanguageToggle';
import { getThemeColors } from '@/functions/ThemeFunction';
import { getTranslations } from '@/functions/TranslationFunction';

export function useHomeLogic() {
  const router = useRouter();
  const { isDarkMode } = useThemeToggle();
  const { lang } = useLanguageToggle();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [pageAnimated, setPageAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const t = getTranslations(lang);

  const themeColors = getThemeColors(isDarkMode);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const animationTimer = setTimeout(() => setPageAnimated(true), 50);
    setIsMounted(true);
    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  return {
    router,
    isDarkMode,
    sectionRef,
    isMounted,
    pageAnimated,
    isMobile,
    t,
    themeColors,
    lang,
  };
}
