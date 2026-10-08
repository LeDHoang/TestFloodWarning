import { useEffect, useState } from 'react';
import { Masthead, type Screen } from './ui/Masthead';
import { Cover } from './screens/Cover';
import { Live } from './screens/Live';
import { Network } from './screens/Network';
import { Incident } from './screens/Incident';
import { Model } from './screens/Model';

const read = (): Screen => {
  const h = window.location.hash.replace('#', '') as Screen;
  return ['cover', 'live', 'network', 'incident', 'model'].includes(h) ? h : 'cover';
};

export function App() {
  const [screen, setScreen] = useState<Screen>(read);
  useEffect(() => {
    const on = () => setScreen(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return (
    <div className="min-w-[1280px] min-h-screen">
      <Masthead active={screen} />
      <main className="px-10 pb-10">
        {screen === 'cover' && <Cover />}
        {screen === 'live' && <Live />}
        {screen === 'network' && <Network />}
        {screen === 'incident' && <Incident />}
        {screen === 'model' && <Model />}
      </main>
    </div>
  );
}
