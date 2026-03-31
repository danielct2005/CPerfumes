'use client';

import { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { CartProvider } from '@/context/cart-context';

interface ProvidersProps {
  children: ReactNode;
}

// Hydration-safe providers
export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering nothing until mounted
  if (!mounted) {
    return null;
  }

  return <CartProvider>{children}</CartProvider>;
}
