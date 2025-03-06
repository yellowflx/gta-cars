import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {type FormattedCar, formatCars} from '@/lib/formatCars';
import {useQuery} from '@tanstack/react-query';
import {Search} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {Checkbox} from '../ui/checkbox';
import {VirtualCarList} from './VirtualCarList';

const sortByPrice = (a: FormattedCar, b: FormattedCar) => {
  const getNumericPrice = (price: string | undefined): number => {
    if (!price) return 0;
    // Remove all non-numeric characters except decimal point
    const numericString = price.replace(/[^0-9.]/g, '');
    return Number.parseFloat(numericString) || 0;
  };

  const priceA = getNumericPrice(a.price);
  const priceB = getNumericPrice(b.price);

  return priceA - priceB;
};

export const CarList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price (desc)');
  const [favorites, setFavorites] = useState<string[] | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [favOnly, setFavOnly] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCars');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!favorites) return;
    localStorage.setItem('favoriteCars', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (car: FormattedCar) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites?.includes(car.name)) {
        const updatedFavorites = prevFavorites.filter((name) => name !== car.name);
        if (!updatedFavorites.length) {
          setFavOnly(false);
        }
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
      console.log('Formatted cars:', formattedCars.length);
      const uniqueClasses = Array.from(new Set(formattedCars.map((car) => car.class)));
      setClasses(uniqueClasses.toSorted());
      return formattedCars;
    },
  });

  // Filter and sort cars
  const filteredAndSortedCars = useMemo(
    () =>
      cars
        ?.filter((car) => {
          if (selectedClass !== 'all' && car.class !== selectedClass) {
            return false;
          }
          if (favOnly && !favorites?.includes(car.name)) {
            return false;
          }
          return car.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'price (asc)':
              return sortByPrice(a, b);
            case 'price (desc)':
              return sortByPrice(b, a);
            case 'nameAZ':
              return a.name.localeCompare(b.name);
            case 'nameZA':
              return b.name.localeCompare(a.name);
            default:
              return 0;
          }
        }),
    [cars, searchQuery, sortBy, selectedClass, favOnly, favorites],
  );

  return (
    <div className="h-screen bg-background">
      <div className="sticky top-0 z-10 px-6 py-4">
        <h2 className="mb-4 font-bold text-2xl text-primary">GTA Online Vehicle List</h2>
        {/* Search and Sort Controls */}
        <div className="flex flex-col items-center justify-start gap-4 sm:flex-row">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 pl-8"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price (desc)">Price (High to Low)</SelectItem>
              <SelectItem value="price (asc)">Price (Low to High)</SelectItem>
              <SelectItem value="nameAZ">Name (A-Z)</SelectItem>
              <SelectItem value="nameZA">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vehicle class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classes.map((carClass) => (
                <SelectItem key={carClass} value={carClass}>
                  {carClass}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorites"
              disabled={!favorites || !favorites.length}
              checked={favOnly}
              onCheckedChange={() => setFavOnly(!favOnly)}
            />
            <label
              htmlFor="favorites"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Favorites ({favorites?.length || 0})
            </label>
          </div>
        </div>
      </div>
      {isLoading || !filteredAndSortedCars ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading vehicles...</p>
        </div>
      ) : (
        <VirtualCarList
          cars={filteredAndSortedCars}
          favorites={favorites}
          action={toggleFavorite}
        />
      )}
    </div>
  );
};
