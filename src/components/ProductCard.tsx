import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IMAGE_VARIANT, IProduct } from "@/types/product";
import { Eye } from "lucide-react";

export default function ProductCard({ product }: { product: IProduct }) {
  const lowestPrice = product.variants.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants[0]?.price || 0
  );

  return (
    <div className="group relative bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <figure className="relative pt-4 px-4 bg-zinc-50/50">
        <Link
          href={`/products/${product._id}`}
          className="block relative rounded-lg overflow-hidden aspect-square"
          style={{
            aspectRatio:
              IMAGE_VARIANT.SQUARE.dimensions.width /
              IMAGE_VARIANT.SQUARE.dimensions.height,
          }}
        >
          <IKImage
            path={product.imageUrl}
            alt={product.name}
            loading="eager"
            transformation={[
              {
                height: IMAGE_VARIANT.SQUARE.dimensions.height.toString(),
                width: IMAGE_VARIANT.SQUARE.dimensions.width.toString(),
                cropMode: "extract",
                focus: "center",
                quality: 80,
              },
            ]}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Subtle dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </Link>
      </figure>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <Link
          href={`/products/${product._id}`}
          className="block group-hover:text-indigo-600 transition-colors"
        >
          <h2 className="text-lg font-bold text-zinc-900 leading-tight mb-2 line-clamp-1">
            {product.name}
          </h2>
        </Link>

        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Footer: Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 font-medium">From</span>
            <span className="text-lg font-bold text-zinc-900">
              ${lowestPrice.toFixed(2)}
            </span>
          </div>

          <Link
            href={`/products/${product._id}`}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-transform active:scale-95 shadow-md shadow-zinc-900/10"
          >
            <Eye className="w-3.5 h-3.5" />
            View Options
          </Link>
        </div>
      </div>
    </div>
  );
}