import { Types } from "mongoose";
import { ImageVariant } from "./product";

/* -----------------------------
   Populated types (for .populate)
--------------------------------*/
export interface PopulatedUser {
  _id: Types.ObjectId;
  email: string;
}

export interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
  imageUrl: string;
}

/* -----------------------------
   Order Status
--------------------------------*/
export type OrderStatus = "pending" | "completed" | "failed";

/* -----------------------------
   Order Type
--------------------------------*/
export interface Order {
  _id?: Types.ObjectId;

  userId: Types.ObjectId | PopulatedUser;
  productId: Types.ObjectId | PopulatedProduct;

  variant: ImageVariant;

  razorpayOrderId: string;
  razorpayPaymentId?: string;

  amount: number;

  status: OrderStatus;

  downloadUrl?: string;
  previewUrl?: string;

  createdAt: Date;
}
