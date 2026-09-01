import Stage from '@/components/three/Stage';
import ScrollProvider from '@/components/ScrollProvider';
import Scrim from '@/components/Scrim';
import Preloader from '@/components/Preloader';
import LossCurve from '@/components/hud/LossCurve';
import Nav from '@/components/hud/Nav';
import ResumeButton from '@/components/hud/ResumeButton';

import Hero from '@/components/sections/Hero';
import Identity from '@/components/sections/Identity';
import Thesis from '@/components/sections/Thesis';
import Signal from '@/components/sections/Signal';
import Work from '@/components/sections/Work';
import Research from '@/components/sections/Research';
import Trajectory from '@/components/sections/Trajectory';
import Record from '@/components/sections/Record';
import Convergence from '@/components/sections/Convergence';

export default function Home() {
  return (
    <ScrollProvider>
      <Preloader />
      <Stage />
      <Scrim />
      <LossCurve />
      <Nav />
      <ResumeButton />

      <main className="relative z-10">
        <Hero />
        <Identity />
        <Thesis />
        <Signal />
        <Work />
        <Research />
        <Trajectory />
        <Record />
        <Convergence />
      </main>
    </ScrollProvider>
  );
}
