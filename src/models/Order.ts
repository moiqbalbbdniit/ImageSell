import mongoose, { Schema, model, models } from "mongoose";
import { Order as OrderType } from "@/types/order";
import { ImageVariantType } from "@/types/product";

/* -----------------------------
   Schema
--------------------------------*/
const orderSchema = new Schema<OrderType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    variant: {
      type: {
        type: String,
        required: true,
        enum: ["SQUARE", "PORTRAIT", "WIDE"] as ImageVariantType[],
        uppercase: true,
      },
      license: {
        type: String,
        required: true,
        enum: ["personal", "commercial"],
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },

    downloadUrl: String,
    previewUrl: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

/* -----------------------------
   Export (Next.js safe)
--------------------------------*/
const Order =
  models.Order || model<OrderType>("Order", orderSchema);

export default Order;
