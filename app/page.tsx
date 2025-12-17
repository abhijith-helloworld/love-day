import Scene from '@/components/Scene';
import StageButtons from '@/components/StageButtons';
import FinalQuestion from '@/components/FinalQuestion';

export default function Home() {
  return (
    <main className='relative h-screen overflow-hidden'>
      <Scene />
      <StageButtons />
      <FinalQuestion />
    </main>
  );
}
