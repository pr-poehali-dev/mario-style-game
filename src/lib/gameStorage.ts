export interface GameSave {
  coins: number;
  maxLives: number;
  hasDoubleJump: boolean;
  currentLevel: number;
  highScore: number;
  completedLevels: number[];
}

const STORAGE_KEY = 'platform-game-save';

export const saveGame = (data: GameSave): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): GameSave | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load game:', error);
  }
  return null;
};

export const clearGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game:', error);
  }
};

export const getDefaultSave = (): GameSave => ({
  coins: 0,
  maxLives: 3,
  hasDoubleJump: false,
  currentLevel: 1,
  highScore: 0,
  completedLevels: []
});
