import { useState, useEffect } from 'react';
import GameMenu from '@/components/game/GameMenu';
import GameCanvas from '@/components/game/GameCanvas';
import Shop from '@/components/game/Shop';
import { Position, PowerUp, ShopItem } from '@/components/game/types';
import { levels, getLevel, getTotalLevels } from '@/components/game/levels';
import { saveGame, loadGame, getDefaultSave } from '@/lib/gameStorage';
import { getGamepadState, isGamepadConnected } from '@/lib/gamepad';

const Index = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 400 });
  const [velocity, setVelocity] = useState<Position>({ x: 0, y: 0 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxLives, setMaxLives] = useState(3);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [jumpsLeft, setJumpsLeft] = useState(2);
  const [hasDoubleJump, setHasDoubleJump] = useState(false);
  const [touchDirection, setTouchDirection] = useState<'left' | 'right' | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const [lastJumpState, setLastJumpState] = useState(false);
  
  const currentLevel = getLevel(currentLevelId);
  const [boss, setBoss] = useState(currentLevel!.boss);
  const [gameCoins, setGameCoins] = useState(currentLevel!.coins);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setCoins(saved.coins);
      setMaxLives(saved.maxLives);
      setHasDoubleJump(saved.hasDoubleJump);
      setCurrentLevelId(saved.currentLevel);
      setHighScore(saved.highScore);
      setCompletedLevels(saved.completedLevels);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveGame({
        coins,
        maxLives,
        hasDoubleJump,
        currentLevel: currentLevelId,
        highScore,
        completedLevels
      });
    }
  }, [coins, maxLives, hasDoubleJump, currentLevelId, highScore, completedLevels, isLoaded]);

  const shopItems: ShopItem[] = [
    { id: 'life', name: 'Дополнительная жизнь', icon: '❤️', cost: 100, description: '+1 жизнь', type: 'extraLife' },
    { id: 'doublejump', name: 'Двойной прыжок', icon: '🦘', cost: 150, description: 'Позволяет прыгать дважды', type: 'doubleJump' },
    { id: 'speed', name: 'Усиление скорости', icon: '⚡', cost: 80, description: '+30 сек скорости', type: 'speedBoost' },
    { id: 'shield', name: 'Защитный щит', icon: '🛡️', cost: 120, description: '+30 сек защиты', type: 'shield' }
  ];

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -12;
  const MOVE_SPEED = 5;
  const PLAYER_SIZE = 40;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
      if (e.key === ' ' && jumpsLeft > 0) {
        setVelocity(v => ({ ...v, y: JUMP_STRENGTH }));
        setJumpsLeft(j => j - 1);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jumpsLeft]);

  const handleJump = () => {
    if (jumpsLeft > 0) {
      setVelocity(v => ({ ...v, y: JUMP_STRENGTH }));
      setJumpsLeft(j => j - 1);
    }
  };

  const buyItem = (item: ShopItem) => {
    if (coins < item.cost) return;
    
    setCoins(c => c - item.cost);
    
    switch (item.type) {
      case 'extraLife':
        setLives(l => Math.min(l + 1, maxLives + 1));
        setMaxLives(m => m + 1);
        break;
      case 'doubleJump':
        setHasDoubleJump(true);
        break;
      case 'speedBoost':
        setPowerUps(p => [...p.filter(pu => pu.type !== 'speed'), { type: 'speed', endTime: Date.now() + 30000 }]);
        break;
      case 'shield':
        setPowerUps(p => [...p.filter(pu => pu.type !== 'shield'), { type: 'shield', endTime: Date.now() + 30000 }]);
        break;
    }
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setPowerUps(prev => prev.filter(p => p.endTime > Date.now()));

      const gamepadState = getGamepadState();
      setGamepadConnected(gamepadState.connected);

      if (gamepadState.jump && !lastJumpState && jumpsLeft > 0) {
        setVelocity(v => ({ ...v, y: JUMP_STRENGTH }));
        setJumpsLeft(j => j - 1);
      }
      setLastJumpState(gamepadState.jump);

      setVelocity(prev => {
        let newVelX = 0;
        const speedMultiplier = powerUps.some(p => p.type === 'speed') ? 1.5 : 1;

        if (keys.has('arrowleft') || keys.has('a') || touchDirection === 'left' || gamepadState.left) {
          newVelX = -MOVE_SPEED * speedMultiplier;
        }
        if (keys.has('arrowright') || keys.has('d') || touchDirection === 'right' || gamepadState.right) {
          newVelX = MOVE_SPEED * speedMultiplier;
        }

        return { x: newVelX, y: prev.y + GRAVITY };
      });

      setPlayerPos(prev => {
        const newX = Math.max(0, Math.min(860, prev.x + velocity.x));
        let newY = prev.y + velocity.y;

        let onPlatform = false;
        currentLevel?.platforms.forEach(platform => {
          if (
            newX + PLAYER_SIZE > platform.x &&
            newX < platform.x + platform.width &&
            prev.y + PLAYER_SIZE <= platform.y &&
            newY + PLAYER_SIZE >= platform.y
          ) {
            if (platform.type === 'trap') {
              if (!powerUps.some(p => p.type === 'shield')) {
                setLives(l => {
                  const newLives = l - 1;
                  if (newLives <= 0) setGameOver(true);
                  return newLives;
                });
                return { x: 50, y: 400 };
              }
            } else if (platform.type === 'powerup' && platform.powerupType) {
              const existingPowerup = powerUps.find(p => p.type === platform.powerupType);
              if (!existingPowerup) {
                setPowerUps(p => [...p, { type: platform.powerupType!, endTime: Date.now() + 5000 }]);
                setScore(s => s + 50);
              }
            }
            newY = platform.y - PLAYER_SIZE;
            setVelocity(v => ({ ...v, y: 0 }));
            setJumpsLeft(hasDoubleJump ? 2 : 1);
            onPlatform = true;
          }
        });

        gameCoins.forEach((coin, index) => {
          if (!coin.collected && 
              Math.abs(newX - coin.x) < 30 && 
              Math.abs(newY - coin.y) < 30) {
            setGameCoins(prev => {
              const newCoins = [...prev];
              newCoins[index] = { ...coin, collected: true };
              return newCoins;
            });
            setCoins(c => c + 10);
            setScore(s => s + 20);
          }
        });

        if (newY > 600) {
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) setGameOver(true);
            return newLives;
          });
          return { x: 50, y: 400 };
        }

        const distanceToBoss = Math.abs(newX - boss.x);
        if (distanceToBoss < 100 && boss.health > 0) {
          const hasPower = powerUps.some(p => p.type === 'power');
          if (hasPower) {
            setBoss(b => {
              const newHealth = Math.max(0, b.health - 2);
              if (newHealth === 0) {
                setBossDefeated(true);
                setScore(s => s + 1000);
                setCoins(c => c + 100);
              }
              return { ...b, health: newHealth, attacking: true };
            });
          } else {
            setBoss(b => ({ ...b, attacking: true }));
            if (Math.random() > 0.95 && !powerUps.some(p => p.type === 'shield')) {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) setGameOver(true);
                return newLives;
              });
            }
          }
        } else {
          setBoss(b => ({ ...b, attacking: false }));
        }

        return { x: newX, y: newY };
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, velocity, keys, powerUps, boss, gameOver, hasDoubleJump, touchDirection, currentLevel, jumpsLeft, lastJumpState]);

  const loadLevel = (levelId: number) => {
    const level = getLevel(levelId);
    if (level) {
      setBoss({ ...level.boss });
      setGameCoins(level.coins.map(c => ({ ...c, collected: false })));
      setPlayerPos({ x: 50, y: 400 });
      setBossDefeated(false);
      setGameOver(false);
      setJumpsLeft(hasDoubleJump ? 2 : 1);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(maxLives);
    setPowerUps([]);
    setCurrentLevelId(1);
    loadLevel(1);
  };

  const nextLevel = () => {
    const newLevelId = currentLevelId + 1;
    if (!completedLevels.includes(currentLevelId)) {
      setCompletedLevels(prev => [...prev, currentLevelId]);
    }
    if (score > highScore) {
      setHighScore(score);
    }
    setCurrentLevelId(newLevelId);
    loadLevel(newLevelId);
  };

  const endGame = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#95E1D3] to-[#4FCDC4] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {!gameStarted ? (
          <GameMenu
            coins={coins}
            hasDoubleJump={hasDoubleJump}
            highScore={highScore}
            completedLevels={completedLevels}
            gamepadConnected={gamepadConnected}
            onStartGame={startGame}
            onOpenShop={() => setShopOpen(true)}
          />
        ) : (
          <GameCanvas
            lives={lives}
            coins={coins}
            score={score}
            powerUps={powerUps}
            platforms={currentLevel?.platforms || []}
            gameCoins={gameCoins}
            playerPos={playerPos}
            boss={boss}
            bossDefeated={bossDefeated}
            gameOver={gameOver}
            hasDoubleJump={hasDoubleJump}
            touchDirection={touchDirection}
            currentLevel={currentLevelId}
            totalLevels={getTotalLevels()}
            background={currentLevel?.background || 'from-sky-300 to-sky-200'}
            onSetTouchDirection={setTouchDirection}
            onJump={handleJump}
            onEndGame={endGame}
            onNextLevel={nextLevel}
          />
        )}
      </div>

      <Shop
        isOpen={shopOpen}
        onClose={setShopOpen}
        coins={coins}
        hasDoubleJump={hasDoubleJump}
        shopItems={shopItems}
        onBuyItem={buyItem}
      />
    </div>
  );
};

export default Index;