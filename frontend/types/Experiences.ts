export interface Slot {
  date: string;
  time: string;
  capacity: number;
  price: number;
  bookedCount: number;
}

export interface Experience{
  _id:string;
  title: string;
  description?: string;
  image: string;
  location: string;
  slots: Slot[];
}