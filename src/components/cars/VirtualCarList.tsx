import {ScrollArea} from '@/components/ui/scroll-area';
import type {FormattedCar} from '@/lib/formatCars';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useCallback, useMemo, useRef} from 'react';
import {CarCard} from './CarCard';

interface VirtualCarListProps {
  cars: FormattedCar[];
  favorites: string[] | null;
  action: (car: FormattedCar) => void;
  columns: number;
}

export const VirtualCarList = (props: VirtualCarListProps) => {
  const cars = useMemo(() => props.cars, [props.cars]);
  const favorites = useMemo(() => props.favorites, [props.favorites]);
  const columns = useMemo(() => props.columns, [props.columns]);

  const parentRef = useRef<HTMLDivElement>(null);
  const memoizedAction = useCallback(props.action, []);

  const rows = useMemo(() => Math.ceil(cars.length / columns), [cars, columns]);

  const estimateSize = useCallback(() => {
    if (typeof window === 'undefined') return 300;
    const width = window.innerWidth;
    const baseHeight = width < 640 ? 380 : 340;
    const gap = width < 640 ? 16 : 24;
    return baseHeight + gap;
  }, []);

  const virtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 3,
    scrollMargin: 0,
  });

  return (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full">
        <div
          ref={parentRef}
          className="relative h-full overflow-hidden bg-background/50 px-4 sm:px-6"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const rowIndex = virtualRow.index;
              const carsInRow = cars.slice(rowIndex * columns, (rowIndex + 1) * columns);

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="absolute top-0 left-0 w-full pb-4"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {carsInRow.map((car) => (
                      <CarCard
                        key={car.name}
                        car={car}
                        action={memoizedAction}
                        favorite={favorites?.includes(car.name) || false}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
