/**
 * Culinary highlights. Price ranges and specific vendors are left as
 * placeholders — add verified details only.
 */
export interface Dish {
  id: string
  name: string
  image: string
  description: string
  priceRange: string
  location: string
}

export const dishes: Dish[] = [
  {
    id: 'dodol',
    name: 'Garut Dodol',
    image: 'dodol.png',
    description: 'The sweet Garut is famous for — chewy, caramel-rich and the souvenir every visitor takes home.',
    priceRange: 'Price range coming soon',
    location: 'Souvenir shops across Garut',
  },
  {
    id: 'burayot',
    name: 'Burayot',
    image: 'burayot.png',
    description: 'A traditional Sundanese palm-sugar snack with a crisp outside and a soft, sweet centre.',
    priceRange: 'Price range coming soon',
    location: 'Traditional snack sellers',
  },
  {
    id: 'chocodot',
    name: 'Chocodot',
    image: 'chocodot.png',
    description: 'Garut’s modern twist on tradition: chewy dodol wrapped in chocolate.',
    priceRange: 'Price range coming soon',
    location: 'Souvenir shops across Garut',
  },
  {
    id: 'baso-aci',
    name: 'Baso Aci',
    image: 'basoaci.png',
    description: 'Bouncy tapioca balls in a spicy, savoury broth — comfort food with a kick.',
    priceRange: 'Price range coming soon',
    location: 'Street stalls & local eateries',
  },
  {
    id: 'sundanese',
    name: 'Traditional Sundanese Food',
    image: 'sundanese.png',
    description: 'Rice, fresh lalapan, sambal and grilled sides, shared together on banana leaves.',
    priceRange: 'Price range coming soon',
    location: 'Sundanese restaurants',
  },
  {
    id: 'street-food',
    name: 'Local Street Food',
    image: 'streetfood.png',
    description: 'Evening grills, steaming carts and snacks you will not find anywhere else.',
    priceRange: 'Price range coming soon',
    location: 'Around the city centre in the evening',
  },
]
