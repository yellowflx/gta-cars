import { createFileRoute } from "@tanstack/react-router";
import { CarList } from "../components/cars";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <CarList />;
}
