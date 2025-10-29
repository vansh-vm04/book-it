import { Schema, model, Document } from "mongoose";

export interface PromoDocument extends Document {
  code: string;
  discountValue: number;
}

const PromoSchema = new Schema<PromoDocument>({
  code: { type: String, required: true, unique: true },
  discountValue: { type: Number, required: true },
});

export interface BookingDocument extends Document {
  experienceId: Schema.Types.ObjectId;
  slotIndex: number;
  name: string;
  email: string;
  promoCode?: string;
  quantity: number;
  totalAmount: number;
  refId: string;
  createdAt: Date;
}

const BookingSchema = new Schema<BookingDocument>(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    slotIndex: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    promoCode: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true },
    refId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Booking = model<BookingDocument>("Booking", BookingSchema);
export const Promo = model<PromoDocument>("Promo", PromoSchema);
