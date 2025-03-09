import {type FormattedCar, formatCars} from '@/lib/formatCars';
import {debounce, getColumnsCount} from '@/lib/utils';
import {useQuery} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';
import {useEffect, useMemo, useState} from 'react';
import {CarFilters} from './CarFilters';
import {VirtualCarList} from './VirtualCarList';

export const CarList = () => {
  const search = useSearch({from: '/'});
  const [favorites, setFavorites] = useState<string[] | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [columns, setColumns] = useState(getColumnsCount());

  useEffect(() => {
    const handleResize = debounce(() => {
      setColumns(getColumnsCount());
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCars');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (!favorites) return;
    localStorage.setItem('favoriteCars', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (car: FormattedCar) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites?.includes(car.name)) {
        const updatedFavorites = prevFavorites.filter((name) => name !== car.name);
        return updatedFavorites;
      }
      return [...(prevFavorites || []), car.name];
    });
  };

  const {data: cars, isLoading} = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await fetch('/cars.json');
      const data = await response.json();
      const formattedCars = formatCars(data);
      console.log('vehicles:', formattedCars.length);
      const uniqueClasses = Array.from(
        new Set(formattedCars.map((car) => car.class).flatMap((v) => v.split(', '))),
      );
      setClasses(uniqueClasses.toSorted());
      return formattedCars;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const classFilteredCars = useMemo(
    () =>
      !search.selectedClass || search.selectedClass === 'all'
        ? cars
        : cars?.filter((car) => car.class.includes(search.selectedClass)),
    [cars, search.selectedClass],
  );

  const favoritesFilteredCars = useMemo(
    () =>
      search.favOnly
        ? classFilteredCars?.filter((car) => favorites?.includes(car.name))
        : classFilteredCars,
    [classFilteredCars, search.favOnly, favorites],
  );

  const searchFilteredCars = useMemo(
    () =>
      search.q
        ? favoritesFilteredCars?.filter((car) => {
            return car.name.toLowerCase().includes(search.q?.toLowerCase() || '');
          })
        : favoritesFilteredCars,
    [favoritesFilteredCars, search.q],
  );

  const sortedCars = useMemo(
    () =>
      searchFilteredCars?.sort((a, b) => {
        switch (search.sortBy || 'priceZA') {
          case 'priceZA':
            return b.price - a.price;
          case 'priceAZ':
            return a.price - b.price;
          case 'nameAZ':
            return a.name.localeCompare(b.name);
          case 'nameZA':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      }),
    [searchFilteredCars, search.sortBy],
  );

  return (
    <div className="flex h-screen flex-col gap-4 bg-background">
      <div className="top-0 z-10 px-6 pt-4">
        <h2 className="mb-4 font-bold text-2xl text-primary">GTA Online Vehicle List</h2>
        <CarFilters classes={classes} favCount={favorites?.length || 0} />
      </div>
      {isLoading || !sortedCars ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading vehicles...</p>
        </div>
      ) : (
        <VirtualCarList
          cars={sortedCars}
          favorites={favorites}
          action={toggleFavorite}
          columns={columns}
        />
      )}
    </div>
  );
};
