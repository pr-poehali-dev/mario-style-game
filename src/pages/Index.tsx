import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Position {
  x: number;
  y: number;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'trap' | 'powerup';
  powerupType?: 'speed' | 'shield' | 'power';
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

interface PowerUp {
  type: 'speed' | 'shield' | 'power';
  endTime: number;
}

interface Boss {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  attacking: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  type: 'extraLife' | 'doubleJump' | 'speedBoost' | 'shield';
}

const Index = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 400 });
  const [velocity, setVelocity] = useState<Position>({ x: 0, y: 0 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
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
  
  const [boss, setBoss] = useState<Boss>({
    x: 700,
    y: 350,
    health: 100,
    maxHealth: 100,
    attacking: false
  });

  const [gameCoins, setGameCoins] = useState<Coin[]>([
    { x: 150, y: 470, collected: false },
    { x: 300, y: 420, collected: false },
    { x: 450, y: 370, collected: false },
    { x: 250, y: 270, collected: false },
    { x: 450, y: 220, collected: false },
    { x: 600, y: 170, collected: false },
    { x: 750, y: 420, collected: false }
  ]);

  const platforms: Platform[] = [
    { x: 0, y: 500, width: 200, type: 'normal' },
    { x: 250, y: 450, width: 100, type: 'powerup', powerupType: 'speed' },
    { x: 400, y: 400, width: 100, type: 'normal' },
    { x: 550, y: 350, width: 80, type: 'trap' },
    { x: 680, y: 300, width: 100, type: 'powerup', powerupType: 'shield' },
    { x: 200, y: 300, width: 150, type: 'normal' },
    { x: 400, y: 250, width: 100, type: 'powerup', powerupType: 'power' },
    { x: 550, y: 200, width: 120, type: 'normal' },
    { x: 700, y: 450, width: 200, type: 'normal' }
  ];

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

      setVelocity(prev => {
        let newVelX = 0;
        const speedMultiplier = powerUps.some(p => p.type === 'speed') ? 1.5 : 1;

        if (keys.has('arrowleft') || keys.has('a') || touchDirection === 'left') {
          newVelX = -MOVE_SPEED * speedMultiplier;
        }
        if (keys.has('arrowright') || keys.has('d') || touchDirection === 'right') {
          newVelX = MOVE_SPEED * speedMultiplier;
        }

        return { x: newVelX, y: prev.y + GRAVITY };
      });

      setPlayerPos(prev => {
        const newX = Math.max(0, Math.min(860, prev.x + velocity.x));
        let newY = prev.y + velocity.y;

        let onPlatform = false;
        platforms.forEach(platform => {
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
  }, [gameStarted, velocity, keys, powerUps, boss, gameOver, hasDoubleJump, touchDirection]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(maxLives);
    setPowerUps([]);
    setBossDefeated(false);
    setGameOver(false);
    setPlayerPos({ x: 50, y: 400 });
    setJumpsLeft(hasDoubleJump ? 2 : 1);
    setBoss({ x: 700, y: 350, health: 100, maxHealth: 100, attacking: false });
    setGameCoins(prev => prev.map(c => ({ ...c, collected: false })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#95E1D3] to-[#4FCDC4] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {!gameStarted ? (
          <Card className="p-12 text-center shadow-2xl bg-white/95 backdrop-blur">
            <h1 className="text-6xl mb-6 text-[#FF6B6B] drop-shadow-lg">
              🏃‍♂️ Платформер Приключение
            </h1>
            <p className="text-2xl mb-8 text-gray-700 font-semibold">
              Собирай монеты, усиления и побеждай босса!
            </p>
            
            <div className="mb-8 flex justify-center gap-6">
              <Badge className="bg-[#FFF66D] text-gray-800 text-2xl px-6 py-3">
                💰 Монеты: {coins}
              </Badge>
              <Button
                onClick={() => setShopOpen(true)}
                className="bg-[#AA96DA] hover:bg-[#9980cc] text-white text-xl px-6 py-3"
              >
                🏪 Магазин
              </Button>
            </div>

            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Badge className="bg-[#FFF66D] text-gray-800 text-lg px-4 py-2">⚡</Badge>
                <span className="text-lg">Жёлтые платформы = Скорость</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-[#95E1D3] text-gray-800 text-lg px-4 py-2">🛡️</Badge>
                <span className="text-lg">Мятные платформы = Щит</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-[#F38181] text-white text-lg px-4 py-2">💪</Badge>
                <span className="text-lg">Розовые платформы = Сила</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-[#FF6B6B] text-white text-lg px-4 py-2">⚠️</Badge>
                <span className="text-lg">Красные платформы = Ловушка!</span>
              </div>
              {hasDoubleJump && (
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#AA96DA] text-white text-lg px-4 py-2">🦘</Badge>
                  <span className="text-lg">Двойной прыжок активен!</span>
                </div>
              )}
            </div>
            <button
              onClick={startGame}
              className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-2xl font-bold px-12 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all"
            >
              Начать Игру 🚀
            </button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl flex-wrap gap-4">
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex gap-2">
                  {[...Array(lives)].map((_, i) => (
                    <span key={i} className="text-3xl">❤️</span>
                  ))}
                </div>
                <Badge className="bg-[#FFF66D] text-gray-800 text-xl px-4 py-2">
                  💰 {coins}
                </Badge>
                <Badge className="bg-[#4FCDC4] text-white text-xl px-4 py-2">
                  Очки: {score}
                </Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                {powerUps.map((p, i) => (
                  <Badge key={i} className={`text-lg px-3 py-2 ${
                    p.type === 'speed' ? 'bg-[#FFF66D] text-gray-800' :
                    p.type === 'shield' ? 'bg-[#95E1D3] text-gray-800' :
                    'bg-[#F38181] text-white'
                  }`}>
                    {p.type === 'speed' ? '⚡ Скорость' :
                     p.type === 'shield' ? '🛡️ Щит' :
                     '💪 Сила'}
                  </Badge>
                ))}
              </div>
            </div>

            <Card className="relative h-[600px] bg-gradient-to-b from-sky-300 to-sky-200 overflow-hidden shadow-2xl">
              {platforms.map((platform, i) => (
                <div
                  key={i}
                  className={`absolute rounded-lg shadow-lg ${
                    platform.type === 'trap' ? 'bg-[#FF6B6B] animate-pulse' :
                    platform.type === 'powerup' && platform.powerupType === 'speed' ? 'bg-[#FFF66D]' :
                    platform.type === 'powerup' && platform.powerupType === 'shield' ? 'bg-[#95E1D3]' :
                    platform.type === 'powerup' && platform.powerupType === 'power' ? 'bg-[#F38181]' :
                    'bg-[#8B4513]'
                  }`}
                  style={{
                    left: platform.x,
                    top: platform.y,
                    width: platform.width,
                    height: 20,
                  }}
                />
              ))}

              {gameCoins.map((coin, i) => !coin.collected && (
                <div
                  key={i}
                  className="absolute text-2xl animate-pulse"
                  style={{ left: coin.x, top: coin.y }}
                >
                  💰
                </div>
              ))}

              <div
                className={`absolute w-10 h-10 bg-[#AA96DA] rounded-full shadow-xl transition-all ${
                  powerUps.some(p => p.type === 'shield') ? 'ring-4 ring-[#95E1D3]' : ''
                }`}
                style={{
                  left: playerPos.x,
                  top: playerPos.y,
                }}
              >
                <span className="text-2xl">🏃</span>
              </div>

              {!bossDefeated && (
                <div className="absolute" style={{ left: boss.x, top: boss.y }}>
                  <div className={`w-16 h-16 bg-[#FF6B6B] rounded-lg shadow-2xl flex items-center justify-center ${
                    boss.attacking ? 'animate-pulse' : ''
                  }`}>
                    <span className="text-4xl">👹</span>
                  </div>
                  <div className="mt-2 w-16">
                    <Progress value={(boss.health / boss.maxHealth) * 100} className="h-2" />
                  </div>
                </div>
              )}

              {bossDefeated && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Card className="p-8 text-center bg-white shadow-2xl">
                    <h2 className="text-5xl mb-4 text-[#FF6B6B]">🎉 Победа!</h2>
                    <p className="text-2xl mb-4">Босс повержен!</p>
                    <p className="text-xl mb-2">Финальный счёт: {score}</p>
                    <p className="text-xl mb-6">Монеты: {coins}</p>
                    <button
                      onClick={() => setGameStarted(false)}
                      className="bg-[#FF6B6B] text-white text-xl px-8 py-3 rounded-full hover:bg-[#ff5252] transition-all"
                    >
                      В меню
                    </button>
                  </Card>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Card className="p-8 text-center bg-white shadow-2xl">
                    <h2 className="text-5xl mb-4 text-[#FF6B6B]">💀 Игра окончена</h2>
                    <p className="text-xl mb-2">Финальный счёт: {score}</p>
                    <p className="text-xl mb-6">Монеты: {coins}</p>
                    <button
                      onClick={() => setGameStarted(false)}
                      className="bg-[#FF6B6B] text-white text-xl px-8 py-3 rounded-full hover:bg-[#ff5252] transition-all"
                    >
                      Попробовать снова
                    </button>
                  </Card>
                </div>
              )}
            </Card>

            <div className="flex gap-4 justify-center">
              <Button
                onTouchStart={() => setTouchDirection('left')}
                onTouchEnd={() => setTouchDirection(null)}
                onMouseDown={() => setTouchDirection('left')}
                onMouseUp={() => setTouchDirection(null)}
                className="bg-[#4FCDC4] hover:bg-[#3db3aa] text-white text-3xl w-20 h-20 rounded-full shadow-xl"
              >
                ←
              </Button>
              <Button
                onClick={handleJump}
                className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-3xl w-20 h-20 rounded-full shadow-xl"
              >
                ↑
              </Button>
              <Button
                onTouchStart={() => setTouchDirection('right')}
                onTouchEnd={() => setTouchDirection(null)}
                onMouseDown={() => setTouchDirection('right')}
                onMouseUp={() => setTouchDirection(null)}
                className="bg-[#4FCDC4] hover:bg-[#3db3aa] text-white text-3xl w-20 h-20 rounded-full shadow-xl"
              >
                →
              </Button>
            </div>

            <Card className="p-4 bg-white/95 backdrop-blur text-center">
              <p className="text-lg text-gray-700">
                🎮 ПК: <span className="font-bold">A/D</span> или <span className="font-bold">←/→</span> - движение, 
                <span className="font-bold"> Пробел</span> - прыжок
                {hasDoubleJump && <span className="ml-2">| 🦘 Двойной прыжок!</span>}
              </p>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={shopOpen} onOpenChange={setShopOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#FF6B6B]">🏪 Магазин усилений</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Badge className="bg-[#FFF66D] text-gray-800 text-2xl px-6 py-3">
                💰 Ваши монеты: {coins}
              </Badge>
            </div>
            <div className="grid gap-4">
              {shopItems.map(item => (
                <Card key={item.id} className="p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-[#FFF66D] text-gray-800 text-lg px-4 py-2 mb-2">
                      💰 {item.cost}
                    </Badge>
                    <Button
                      onClick={() => buyItem(item)}
                      disabled={coins < item.cost || (item.type === 'doubleJump' && hasDoubleJump)}
                      className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white disabled:opacity-50"
                    >
                      {item.type === 'doubleJump' && hasDoubleJump ? 'Куплено' : 'Купить'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
