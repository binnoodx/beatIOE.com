// app/components/RouteLoader.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';

export default function RouteLoader() {
  const pathname = usePathname();
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.continuousStart();
    }

    // simulate slight delay
    const timeout = setTimeout(() => {
      if (ref.current) {
        ref.current.complete();
      }
    }, 500); // fake loading time

    return () => clearTimeout(timeout);
  }, [pathname]);

  return <LoadingBar color="#ff0000" height={3} ref={ref} shadow={true} />;
}
