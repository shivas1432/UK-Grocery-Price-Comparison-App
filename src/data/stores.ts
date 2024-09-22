import { Store } from '../types';

export const stores: Store[] = [
  {
    id: 'tesco',
    name: 'Tesco',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Tesco-Logo.png',
    color: '#0050AA',
    website: 'https://tesco.com',
    locations: [
      {
        id: 'tesco-1',
        address: '123 High Street, London',
        postcode: 'SW1A 1AA',
        lat: 51.5074,
        lng: -0.1278,
        openingHours: {
          monday: { open: '06:00', close: '24:00' },
          tuesday: { open: '06:00', close: '24:00' },
          wednesday: { open: '06:00', close: '24:00' },
          thursday: { open: '06:00', close: '24:00' },
          friday: { open: '06:00', close: '24:00' },
          saturday: { open: '06:00', close: '22:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    ]
  },
  {
    id: 'asda',
    name: 'ASDA',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/ASDA-Logo.png',
    color: '#00B050',
    website: 'https://asda.com',
    locations: [
      {
        id: 'asda-1',
        address: '456 Market Street, Manchester',
        postcode: 'M1 1AA',
        lat: 53.4808,
        lng: -2.2426,
        openingHours: {
          monday: { open: '07:00', close: '23:00' },
          tuesday: { open: '07:00', close: '23:00' },
          wednesday: { open: '07:00', close: '23:00' },
          thursday: { open: '07:00', close: '23:00' },
          friday: { open: '07:00', close: '23:00' },
          saturday: { open: '07:00', close: '22:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    ]
  },
  {
    id: 'sainsburys',
    name: "Sainsbury's",
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Sainsburys-Logo.png',
    color: '#FF8200',
    website: 'https://sainsburys.co.uk',
    locations: [
      {
        id: 'sainsburys-1',
        address: '789 King Street, Birmingham',
        postcode: 'B1 1AA',
        lat: 52.4862,
        lng: -1.8904,
        openingHours: {
          monday: { open: '07:00', close: '22:00' },
          tuesday: { open: '07:00', close: '22:00' },
          wednesday: { open: '07:00', close: '22:00' },
          thursday: { open: '07:00', close: '22:00' },
          friday: { open: '07:00', close: '22:00' },
          saturday: { open: '07:00', close: '21:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    ]
  },
  {
    id: 'morrisons',
    name: 'Morrisons',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Morrisons-Logo.png',
    color: '#FFD200',
    website: 'https://morrisons.com',
    locations: [
      {
        id: 'morrisons-1',
        address: '321 Church Lane, Leeds',
        postcode: 'LS1 1AA',
        lat: 53.8008,
        lng: -1.5491,
        openingHours: {
          monday: { open: '07:00', close: '22:00' },
          tuesday: { open: '07:00', close: '22:00' },
          wednesday: { open: '07:00', close: '22:00' },
          thursday: { open: '07:00', close: '22:00' },
          friday: { open: '07:00', close: '22:00' },
          saturday: { open: '07:00', close: '21:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    ]
  },
  {
    id: 'lidl',
    name: 'Lidl',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Lidl-Logo.png',
    color: '#0050AA',
    website: 'https://lidl.co.uk',
    locations: [
      {
        id: 'lidl-1',
        address: '654 Mill Road, Liverpool',
        postcode: 'L1 1AA',
        lat: 53.4084,
        lng: -2.9916,
        openingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '21:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    ]
  },
  {
    id: 'aldi',
    name: 'Aldi',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Aldi-Logo.png',
    color: '#FF6600',
    website: 'https://aldi.co.uk',
    locations: [
      {
        id: 'aldi-1',
        address: '987 Victoria Road, Glasgow',
        postcode: 'G1 1AA',
        lat: 55.8642,
        lng: -4.2518,
        openingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '21:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    ]
  }
];

export const getStoreById = (id: string): Store | undefined => {
  return stores.find(store => store.id === id);
};

export const getStoreColor = (storeId: string): string => {
  const store = getStoreById(storeId);
  return store?.color || '#6B7280';
};