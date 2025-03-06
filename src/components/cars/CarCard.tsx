import {type FormattedCar} from '@/lib/formatCars';
import {Heart, HeartOff} from 'lucide-react';
import {Button} from '../ui/button';

interface CarCardProps {
  car: FormattedCar;
  favorite: boolean;
  action: (car: FormattedCar) => void;
}

export const CarCard = ({car, action, favorite}: CarCardProps) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-card shadow-md">
      <div className="h-48 overflow-hidden bg-black">
        <img
          src={`https://images.weserv.nl/?url=https://www.gtabase.com/${car.image}`}
          alt={car.name}
          className="h-full w-full object-cover transition-opacity"
        />
      </div>
      <div className="space-y-3 p-4">
        <h3 className="font-bold text-foreground text-xl tracking-tight">{car.name}</h3>
        <div className="flex items-center justify-between">
          <span className="rounded bg-primary/10 px-2 py-1 text-primary text-sm">{car.class}</span>
          <span className="font-bold text-primary text-xl tracking-tight">
            ${car.price?.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <a
            href={`https://www.gtabase.com${car.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 cursor-pointer"
          >
            <Button variant="secondary" className="w-full cursor-pointer">
              Details
            </Button>
          </a>
          <Button
            variant={favorite ? 'destructive' : 'default'}
            size="icon"
            onClick={() => action(car)}
            className="group shrink-0 cursor-pointer "
          >
            {favorite ? (
              <div>
                <Heart className="fill-background transition-all duration-200 group-hover:hidden" />
                <HeartOff className="hidden transition-all duration-200 group-hover:block" />
              </div>
            ) : (
              <Heart className="transition-all duration-200 group-hover:fill-background" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
