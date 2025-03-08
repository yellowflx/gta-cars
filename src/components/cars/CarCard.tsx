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
    <div className="group relative w-full overflow-hidden rounded-lg bg-card shadow-md">
      <div className="relative bg-black pb-[56.25%]">
        <img
          src={`https://images.weserv.nl/?url=https://www.gtabase.com/${car.image}`}
          alt={car.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <h3 className="line-clamp-1 font-bold text-foreground text-lg tracking-tight">
          {car.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded bg-primary/10 px-2 py-1 text-primary text-xs">{car.class}</span>
          <span className="font-bold text-base text-primary tracking-tight">
            ${car.price?.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </span>
        </div>
        <div className="mt-2 flex justify-between gap-2">
          <a
            href={`https://www.gtabase.com${car.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" className="w-full">
              Details
            </Button>
          </a>
          <Button
            variant={favorite ? 'destructive' : 'default'}
            size="icon"
            onClick={() => action(car)}
            className="group/btn shrink-0"
          >
            {favorite ? (
              <>
                <Heart className="fill-foreground group-hover/btn:hidden" />
                <HeartOff className="hidden fill-foreground group-hover/btn:block" />
              </>
            ) : (
              <Heart className="group-hover/btn:fill-background" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
