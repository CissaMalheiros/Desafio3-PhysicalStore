import { Schema } from 'mongoose';

export const StoreSchema = new Schema({
  storeID: String,
  storeName: String,
  takeOutInStore: Boolean,
  shippingTimeInDays: Number,
  latitude: String,
  longitude: String,
  address1: String,
  address2: String,
  address3: String,
  city: String,
  district: String,
  state: String,
  type: String,
  country: String,
  postalCode: String,
  telephoneNumber: String,
  emailAddress: String,
});