import { Schema, model, Document } from "mongoose";

export interface Slot {
  date: string;
  time: string;
  capacity: number;
  price: number;
  bookedCount: number;
}

export interface ExperienceDocument extends Document {
  title: string;
  description?: string;
  image: string;
  location: string;
  slots: Slot[];
}

const SlotSchema = new Schema<Slot>(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, required: true, default: 10 },
    price: { type: Number, required: true, default: 1000 },
    bookedCount: { type: Number, required: true },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<ExperienceDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    location: { type: String },
    slots: { type: [SlotSchema], default: [] },
  },
  { timestamps: true }
);

export const Experience = model<ExperienceDocument>(
  "Experience",
  ExperienceSchema
);