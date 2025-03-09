import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {Search} from 'lucide-react';
import {memo, useEffect} from 'react';
import {Checkbox} from '../ui/checkbox';
import {Input} from '../ui/input';

export const CarFilters = memo(({classes, favCount}: {classes: string[]; favCount: number}) => {
  const search = useSearch({from: '/'});
  const navigate = useNavigate();

  useEffect(() => {
    if (!favCount) {
      navigate({
        to: '/',
        search: {...search, favOnly: false},
      });
    }
  }, [favCount, navigate, search]);

  return (
    <div className="flex flex-col items-center justify-start gap-4 sm:flex-row">
      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vehicles..."
          value={search.q}
          onChange={(e) => {
            navigate({
              to: '/',
              search: {...search, q: e.target.value},
            });
          }}
          className="bg-background/50 pl-8"
        />
      </div>
      <Select
        value={search.sortBy || 'priceZA'}
        onValueChange={(value) => {
          navigate({
            to: '/',
            search: {...search, sortBy: value},
          });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="priceZA">Price (High to Low)</SelectItem>
          <SelectItem value="priceAZ">Price (Low to High)</SelectItem>
          <SelectItem value="nameAZ">Name (A-Z)</SelectItem>
          <SelectItem value="nameZA">Name (Z-A)</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={search.selectedClass || 'all'}
        onValueChange={(value) => {
          navigate({
            to: '/',
            search: {...search, selectedClass: value},
          });
        }}
      >
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
          disabled={!favCount}
          checked={search.favOnly || false}
          onCheckedChange={() =>
            navigate({
              to: '/',
              search: {...search, favOnly: !(search.favOnly || false)},
            })
          }
        />
        <label
          htmlFor="favorites"
          className="font-medium text-md leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Favorites only ({favCount})
        </label>
      </div>
    </div>
  );
});
