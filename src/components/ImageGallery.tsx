import { IProduct } from "@/types/product";
import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

interface ImageGalleryProps {
  products: IProduct[];
}

export default function ImageGallery({ products }: ImageGalleryProps) {
  return (
    <div className="w-full">
      {products.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
          <div className="bg-zinc-100 p-4 rounded-full mb-4">
            <PackageOpen className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">
            No products found
          </h3>
          <p className="text-zinc-500 max-w-sm mt-1">
            We couldn't find any digital assets at the moment. Check back later
            for new drops!
          </p>
        </div>
      ) : (
        // Product Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id?.toString()} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}