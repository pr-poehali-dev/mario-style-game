import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GameMenuProps {
  coins: number;
  hasDoubleJump: boolean;
  highScore: number;
  completedLevels: number[];
  gamepadConnected: boolean;
  onStartGame: () => void;
  onOpenShop: () => void;
}

const GameMenu = ({ coins, hasDoubleJump, highScore, completedLevels, gamepadConnected, onStartGame, onOpenShop }: GameMenuProps) => {
  return (
    <Card className="p-12 text-center shadow-2xl bg-white/95 backdrop-blur">
      <h1 className="text-6xl mb-6 text-[#FF6B6B] drop-shadow-lg">
        🏃‍♂️ Платформер Приключение
      </h1>
      <p className="text-2xl mb-8 text-gray-700 font-semibold">
        Собирай монеты, усиления и побеждай босса!
      </p>
      
      <div className="mb-8 space-y-4">
        <div className="flex justify-center gap-6">
          <Badge className="bg-[#FFF66D] text-gray-800 text-2xl px-6 py-3">
            💰 Монеты: {coins}
          </Badge>
          <Button
            onClick={onOpenShop}
            className="bg-[#AA96DA] hover:bg-[#9980cc] text-white text-xl px-6 py-3"
          >
            🏪 Магазин
          </Button>
        </div>
        
        {highScore > 0 && (
          <div className="flex justify-center gap-6">
            <Badge className="bg-[#FF6B6B] text-white text-2xl px-6 py-3">
              🏆 Рекорд: {highScore}
            </Badge>
            <Badge className="bg-[#95E1D3] text-gray-800 text-2xl px-6 py-3">
              ✨ Пройдено уровней: {completedLevels.length}
            </Badge>
          </div>
        )}
      </div>

      {gamepadConnected && (
        <div className="mb-6">
          <Badge className="bg-green-500 text-white text-xl px-6 py-3">
            🎮 Xbox геймпад подключён!
          </Badge>
        </div>
      )}

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

      {gamepadConnected && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <p className="text-lg font-semibold text-green-800 mb-2">🎮 Управление Xbox:</p>
          <div className="space-y-1 text-green-700">
            <p>• <strong>Левый стик</strong> или <strong>Крестовина</strong> - движение</p>
            <p>• <strong>Кнопка A</strong> - прыжок</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <button
          onClick={onStartGame}
          className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-2xl font-bold px-12 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all"
        >
          Начать Игру 🚀
        </button>
        
        {!gamepadConnected && (
          <p className="text-gray-600 text-sm">
            💡 Подсказка: Подключите Xbox геймпад для лучшего опыта игры!
          </p>
        )}
      </div>
    </Card>
  );
};

export default GameMenu;