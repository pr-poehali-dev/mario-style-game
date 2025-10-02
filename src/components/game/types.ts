export interface Position {
  x: number;
  y: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'trap' | 'powerup';
  powerupType?: 'speed' | 'shield' | 'power';
}

export interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

export interface PowerUp {
  type: 'speed' | 'shield' | 'power';
  endTime: number;
}

export interface Boss {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  attacking: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  type: 'extraLife' | 'doubleJump' | 'speedBoost' | 'shield';
}
