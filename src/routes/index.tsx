import {createFileRoute, stripSearchParams} from '@tanstack/react-router';
import {CarList} from '../components/cars';

interface CarSearchParams {
  q: string;
  sortBy: string;
  selectedClass: string;
  favOnly: boolean;
}

const defaultSearch: CarSearchParams = {
  q: '',
  sortBy: 'priceZA',
  selectedClass: 'all',
  favOnly: false,
};

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: (search: CarSearchParams) => {
    return search;
  },
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
});

function App() {
  return <CarList />;
}
