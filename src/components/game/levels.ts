import { Platform, Coin, Boss } from './types';

export interface Level {
  id: number;
  name: string;
  platforms: Platform[];
  coins: Coin[];
  boss: Boss;
  background: string;
}

export const levels: Level[] = [
  {
    id: 1,
    name: 'Зелёные холмы',
    background: 'from-sky-300 to-sky-200',
    platforms: [
      { x: 0, y: 500, width: 200, type: 'normal' },
      { x: 250, y: 450, width: 100, type: 'powerup', powerupType: 'speed' },
      { x: 400, y: 400, width: 100, type: 'normal' },
      { x: 550, y: 350, width: 80, type: 'trap' },
      { x: 680, y: 300, width: 100, type: 'powerup', powerupType: 'shield' },
      { x: 200, y: 300, width: 150, type: 'normal' },
      { x: 400, y: 250, width: 100, type: 'powerup', powerupType: 'power' },
      { x: 550, y: 200, width: 120, type: 'normal' },
      { x: 700, y: 450, width: 200, type: 'normal' }
    ],
    coins: [
      { x: 150, y: 470, collected: false },
      { x: 300, y: 420, collected: false },
      { x: 450, y: 370, collected: false },
      { x: 250, y: 270, collected: false },
      { x: 450, y: 220, collected: false },
      { x: 600, y: 170, collected: false },
      { x: 750, y: 420, collected: false }
    ],
    boss: {
      x: 700,
      y: 350,
      health: 100,
      maxHealth: 100,
      attacking: false
    }
  },
  {
    id: 2,
    name: 'Лавовые пещеры',
    background: 'from-orange-400 to-red-500',
    platforms: [
      { x: 0, y: 500, width: 150, type: 'normal' },
      { x: 200, y: 480, width: 80, type: 'trap' },
      { x: 330, y: 450, width: 90, type: 'powerup', powerupType: 'shield' },
      { x: 470, y: 400, width: 100, type: 'normal' },
      { x: 620, y: 350, width: 70, type: 'trap' },
      { x: 150, y: 350, width: 100, type: 'powerup', powerupType: 'speed' },
      { x: 300, y: 280, width: 120, type: 'normal' },
      { x: 470, y: 230, width: 90, type: 'trap' },
      { x: 610, y: 200, width: 100, type: 'powerup', powerupType: 'power' },
      { x: 720, y: 450, width: 180, type: 'normal' }
    ],
    coins: [
      { x: 100, y: 470, collected: false },
      { x: 240, y: 450, collected: false },
      { x: 380, y: 420, collected: false },
      { x: 520, y: 370, collected: false },
      { x: 200, y: 320, collected: false },
      { x: 350, y: 250, collected: false },
      { x: 520, y: 200, collected: false },
      { x: 660, y: 170, collected: false },
      { x: 800, y: 420, collected: false }
    ],
    boss: {
      x: 750,
      y: 350,
      health: 150,
      maxHealth: 150,
      attacking: false
    }
  },
  {
    id: 3,
    name: 'Ледяные вершины',
    background: 'from-cyan-200 to-blue-300',
    platforms: [
      { x: 0, y: 520, width: 120, type: 'normal' },
      { x: 170, y: 480, width: 90, type: 'powerup', powerupType: 'speed' },
      { x: 310, y: 440, width: 70, type: 'trap' },
      { x: 430, y: 400, width: 110, type: 'normal' },
      { x: 590, y: 360, width: 80, type: 'trap' },
      { x: 720, y: 320, width: 100, type: 'powerup', powerupType: 'shield' },
      { x: 100, y: 320, width: 130, type: 'normal' },
      { x: 280, y: 260, width: 90, type: 'trap' },
      { x: 420, y: 220, width: 100, type: 'powerup', powerupType: 'power' },
      { x: 570, y: 180, width: 110, type: 'normal' },
      { x: 730, y: 140, width: 90, type: 'trap' },
      { x: 750, y: 480, width: 150, type: 'normal' }
    ],
    coins: [
      { x: 80, y: 490, collected: false },
      { x: 220, y: 450, collected: false },
      { x: 360, y: 410, collected: false },
      { x: 480, y: 370, collected: false },
      { x: 640, y: 330, collected: false },
      { x: 150, y: 290, collected: false },
      { x: 330, y: 230, collected: false },
      { x: 470, y: 190, collected: false },
      { x: 620, y: 150, collected: false },
      { x: 780, y: 110, collected: false },
      { x: 820, y: 450, collected: false }
    ],
    boss: {
      x: 780,
      y: 380,
      health: 200,
      maxHealth: 200,
      attacking: false
    }
  },
  {
    id: 4,
    name: 'Темный лес',
    background: 'from-green-800 to-green-950',
    platforms: [
      { x: 0, y: 500, width: 140, type: 'normal' },
      { x: 180, y: 470, width: 70, type: 'trap' },
      { x: 290, y: 440, width: 100, type: 'powerup', powerupType: 'shield' },
      { x: 440, y: 400, width: 80, type: 'trap' },
      { x: 570, y: 360, width: 120, type: 'normal' },
      { x: 740, y: 320, width: 90, type: 'powerup', powerupType: 'speed' },
      { x: 120, y: 340, width: 110, type: 'normal' },
      { x: 280, y: 290, width: 80, type: 'trap' },
      { x: 410, y: 250, width: 100, type: 'powerup', powerupType: 'power' },
      { x: 560, y: 210, width: 90, type: 'trap' },
      { x: 700, y: 170, width: 120, type: 'normal' },
      { x: 100, y: 170, width: 100, type: 'trap' },
      { x: 780, y: 470, width: 120, type: 'normal' }
    ],
    coins: [
      { x: 70, y: 470, collected: false },
      { x: 220, y: 440, collected: false },
      { x: 340, y: 410, collected: false },
      { x: 480, y: 370, collected: false },
      { x: 620, y: 330, collected: false },
      { x: 790, y: 290, collected: false },
      { x: 170, y: 310, collected: false },
      { x: 330, y: 260, collected: false },
      { x: 460, y: 220, collected: false },
      { x: 610, y: 180, collected: false },
      { x: 750, y: 140, collected: false },
      { x: 840, y: 440, collected: false }
    ],
    boss: {
      x: 800,
      y: 370,
      health: 250,
      maxHealth: 250,
      attacking: false
    }
  },
  {
    id: 5,
    name: 'Небесный замок',
    background: 'from-purple-300 to-pink-400',
    platforms: [
      { x: 0, y: 520, width: 130, type: 'normal' },
      { x: 170, y: 490, width: 80, type: 'powerup', powerupType: 'speed' },
      { x: 290, y: 460, width: 70, type: 'trap' },
      { x: 400, y: 420, width: 100, type: 'normal' },
      { x: 540, y: 380, width: 80, type: 'trap' },
      { x: 660, y: 340, width: 110, type: 'powerup', powerupType: 'shield' },
      { x: 100, y: 350, width: 120, type: 'normal' },
      { x: 260, y: 300, width: 80, type: 'trap' },
      { x: 380, y: 260, width: 100, type: 'powerup', powerupType: 'power' },
      { x: 520, y: 220, width: 90, type: 'trap' },
      { x: 650, y: 180, width: 110, type: 'normal' },
      { x: 120, y: 190, width: 100, type: 'trap' },
      { x: 270, y: 150, width: 90, type: 'powerup', powerupType: 'shield' },
      { x: 790, y: 490, width: 110, type: 'normal' }
    ],
    coins: [
      { x: 65, y: 490, collected: false },
      { x: 210, y: 460, collected: false },
      { x: 330, y: 430, collected: false },
      { x: 450, y: 390, collected: false },
      { x: 580, y: 350, collected: false },
      { x: 710, y: 310, collected: false },
      { x: 150, y: 320, collected: false },
      { x: 300, y: 270, collected: false },
      { x: 430, y: 230, collected: false },
      { x: 560, y: 190, collected: false },
      { x: 700, y: 150, collected: false },
      { x: 170, y: 160, collected: false },
      { x: 320, y: 120, collected: false },
      { x: 840, y: 460, collected: false }
    ],
    boss: {
      x: 820,
      y: 390,
      health: 300,
      maxHealth: 300,
      attacking: false
    }
  }
];

export const getLevel = (levelId: number): Level | undefined => {
  return levels.find(level => level.id === levelId);
};

export const getTotalLevels = (): number => {
  return levels.length;
};
