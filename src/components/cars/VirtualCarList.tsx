import {Button} from '@/components/ui/button';
import type {FormattedCar} from '@/lib/formatCars';
import {useVirtualizer} from '@tanstack/react-virtual';
import {ArrowUpCircle} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {CarCard} from './CarCard';

interface VirtualCarListProps {
  cars: FormattedCar[];
  favorites: string[] | null;
  action: (car: FormattedCar) => void;
}

export const VirtualCarList = ({cars, favorites, action}: VirtualCarListProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate number of columns based on screen width
  const getColumnsCount = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1536) return 6; // 2xl
    if (window.innerWidth >= 1280) return 5; // xl
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 3; // md
    if (window.innerWidth >= 640) return 2; // sm
    return 1;
  };

  const [columns, setColumns] = useState(getColumnsCount());

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumnsCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (parentRef.current) {
        setShowScrollTop(parentRef.current.scrollTop > 200);
      }
    };

    parentRef.current?.addEventListener('scroll', handleScroll);
    return () => parentRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  // Create rows based on number of columns
  const rows = Math.ceil(cars.length / columns);

  const virtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350,
    overscan: 20,
  });

  const scrollToTop = () => {
    parentRef.current?.scrollTo({top: 0, behavior: 'instant'});
  };

  return (
    <div
      ref={parentRef}
      className="relative h-[calc(100vh-150px)] overflow-auto bg-background/50 px-6"
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
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {carsInRow.map((car) => (
                  <CarCard
                    key={car.name}
                    car={car}
                    action={action}
                    favorite={favorites?.includes(car.name) || false}
                  />
                ))}
                {carsInRow.length < columns &&
                  Array.from({length: columns - carsInRow.length}).map((_, index) => (
                    <div
                      key={`empty-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                      className="w-full animate-pulse bg-gray-200"
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          variant="secondary"
          className="fixed right-4 bottom-4 rounded-full"
          onClick={scrollToTop}
        >
          <ArrowUpCircle className="h-5 w-5" />
          <span>Scroll to top</span>
        </Button>
      )}
    </div>
  );
};
