export interface VehicleAttributes {
  value: string[] | string;
  frontend_value: string[] | string;
  formatted_value?: string;
  twodecimals_value?: string;
  title: string[];
  type: string;
}

export interface Vehicle {
  id: number;
  slug: string;
  lang: string;
  hits: number;
  name: string;
  catid: number;
  thumbnail: string;
  thumbnail_width: number;
  thumbnail_height: number;
  url: string;
  attr: Record<string, VehicleAttributes>;
  featured: number;
  access: string;
}

export interface VehiclesList {
  [key: string]: Vehicle;
}

export interface FormattedCar {
  name: string;
  class: string;
  image: string;
  price: number;
  url: string;
}

export function formatCars(vehicles: VehiclesList): FormattedCar[] {
  return Object.values(vehicles)
    .filter((vehicle) => {
      // Exclude vehicles that have a "sell" attribute (ct14) with value ["no"]
      // const sellAttr = vehicle?.attr?.ct14;
      // if (sellAttr && Array.isArray(sellAttr.value) && sellAttr.value.includes('no')) {
      //   return false;
      // }
      const priceAttr = vehicle?.attr?.ct13;
      if (!priceAttr || !priceAttr.value) {
        return false;
      }
      // Include only vehicles with Game Edition/Mode "gta-online" (ct5)
      const gameEdition = vehicle?.attr?.ct5;
      if (
        !gameEdition ||
        !Array.isArray(gameEdition.value) ||
        !gameEdition.value.includes('gta-online')
      ) {
        return false;
      }
      return true;
    })
    .map((vehicle) => {
      // Get vehicle class from ct1 frontend_value (join array if needed)
      const vehicleClass = Array.isArray(vehicle?.attr?.ct1?.frontend_value)
        ? vehicle?.attr?.ct1?.frontend_value.join(', ')
        : vehicle?.attr?.ct1?.frontend_value;

      // Get GTA Online Price from ct13, using formatted_value if available
      const price = vehicle?.attr?.ct13?.formatted_value
        ? vehicle?.attr?.ct13.formatted_value
        : vehicle?.attr?.ct13?.value.toString();

      const numericString = price.replace(/[^0-9.]/g, '');

      return {
        name: vehicle.name,
        class: vehicleClass,
        image: vehicle.thumbnail,
        price: Number.parseFloat(numericString || '0'),
        url: vehicle.url,
      };
    });
}
