import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Position, Platform, Coin, PowerUp, Boss } from './types';

interface GameCanvasProps {
  lives: number;
  coins: number;
  score: number;
  powerUps: PowerUp[];
  platforms: Platform[];
  gameCoins: Coin[];
  playerPos: Position;
  boss: Boss;
  bossDefeated: boolean;
  gameOver: boolean;
  hasDoubleJump: boolean;
  touchDirection: 'left' | 'right' | null;
  onSetTouchDirection: (direction: 'left' | 'right' | null) => void;
  onJump: () => void;
  onEndGame: () => void;
}

const GameCanvas = ({
  lives,
  coins,
  score,
  powerUps,
  platforms,
  gameCoins,
  playerPos,
  boss,
  bossDefeated,
  gameOver,
  hasDoubleJump,
  touchDirection,
  onSetTouchDirection,
  onJump,
  onEndGame
}: GameCanvasProps) => {
  return (
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
                onClick={onEndGame}
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
                onClick={onEndGame}
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
          onTouchStart={() => onSetTouchDirection('left')}
          onTouchEnd={() => onSetTouchDirection(null)}
          onMouseDown={() => onSetTouchDirection('left')}
          onMouseUp={() => onSetTouchDirection(null)}
          className="bg-[#4FCDC4] hover:bg-[#3db3aa] text-white text-3xl w-20 h-20 rounded-full shadow-xl"
        >
          ←
        </Button>
        <Button
          onClick={onJump}
          className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-3xl w-20 h-20 rounded-full shadow-xl"
        >
          ↑
        </Button>
        <Button
          onTouchStart={() => onSetTouchDirection('right')}
          onTouchEnd={() => onSetTouchDirection(null)}
          onMouseDown={() => onSetTouchDirection('right')}
          onMouseUp={() => onSetTouchDirection(null)}
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
  );
};

export default GameCanvas;
