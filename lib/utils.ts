export function deltaShortest(target: number, current: number): number {
  let a = target - current;
  a = ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  return a;
}

export type Stage = {
  id: string;
  buttonText?: string;
  fadeIn?: number;      // Transition in duration (ms)
  fadeOut?: number;     // Transition out duration (ms)
  delay?: number;       // Transition delay (ms)
};

export const stageArray: Stage[] = [
  { id: 'envelope' },
  {
    id: 'heart',
    buttonText: 'Veja o Porquê',
    fadeIn: 800,
    fadeOut: 500,
    delay: 5000
  },
  {
    id: 'carousel',
    buttonText: 'Eu tenho um Pedido...',
    fadeIn: 1500,
    fadeOut: 500,
    delay: 30000
  },
  { 
    id: 'question',
    fadeIn: 1500,
    fadeOut: 800,
    delay: 2000
  },
  {
    id: 'final',
    buttonText: 'kkkkkkkkk',
    fadeIn: 800,
    fadeOut: 600,
    delay: 4000
  },
];

export type CardProps = { url: string; text: string; targetRotation: number }

export const cards: Omit<CardProps, 'targetRotation'>[] = [
  { url: '/images/image1.jpg', text: 'Estilosa' },
  { url: '/images/image2.jpg', text: 'Linda' },
  { url: '/images/image3.jpg', text: 'Carinhosa' },
  { url: '/images/image4.jpg', text: 'Caprichosa' },
  { url: '/images/image5.jpg', text: 'Cheirosa' },
  { url: '/images/image6.jpg', text: 'Doidinha' },
  { url: '/images/image7.jpg', text: 'Inteligente' },
]