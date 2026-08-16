import { RouterStore } from '@homecode/ui';
import { useEffect, useState } from 'react';

export function useRouterPath() {
  const [path, setPath] = useState(RouterStore.path);
  useEffect(() => {
    RouterStore.on(setPath);
    return () => RouterStore.un(setPath);
  }, []);
  return path;
}
