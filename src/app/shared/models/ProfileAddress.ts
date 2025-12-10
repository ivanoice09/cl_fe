export interface Address {
  addressId: number;
  addressLine1: string;
  city: string;
  postalCode: string;
  stateProvince: string;
  countryRegion: string;
  addressType: string;
}

export interface AddressCreate {
  addressLine1: string;
  city: string;
  countryRegion: string;
  stateProvince: string;
  postalCode: string;
  addressType: string;
}

export interface AddressUpdate {
  addressId: number;
  addressLine1: string;
  city: string;
  postalCode: string;
  countryRegion: string;
  stateProvince: string;
  addressType: string;
}
