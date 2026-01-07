export const IMAGE_VARIANT = {
  SQUARE: {
    type: "SQUARE",
    dimensions: { width: 1200, height: 1200 },
    label: "Square (1:1)",
    aspectRatio: "1:1",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: { width: 1080, height: 1440 },
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
  WIDE: {
    type: "WIDE",
    dimensions: { width: 1920, height: 1080 },
    label: "Wide (16:9)",
    aspectRatio: "16:9",
  },
} as const;

export type ImageVariantType = keyof typeof IMAGE_VARIANT;

export interface ImageVariant {
  type: ImageVariantType;
  price: number;
  license: "personal" | "commercial";
}

export interface IProduct {
  _id?: string; // client-safe
  name: string;
  description: string;
  imageUrl: string;
  variants: ImageVariant[];
  createdAt: Date;
}
