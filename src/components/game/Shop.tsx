import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShopItem } from './types';

interface ShopProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  coins: number;
  hasDoubleJump: boolean;
  shopItems: ShopItem[];
  onBuyItem: (item: ShopItem) => void;
}

const Shop = ({ isOpen, onClose, coins, hasDoubleJump, shopItems, onBuyItem }: ShopProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                    onClick={() => onBuyItem(item)}
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
  );
};

export default Shop;
