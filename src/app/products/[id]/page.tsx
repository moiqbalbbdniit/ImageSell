"use client";

import { IKImage } from "imagekitio-next";
import { IProduct, ImageVariant, ImageVariantType, IMAGE_VARIANT } from "@/types/product";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Check, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { useNotification } from "@/components/Notification";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(null);
  const { showNotification } = useNotification();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      const id = params?.id;

      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await apiClient.getProduct(id.toString());
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handlePurchase = async (variant: ImageVariant) => {
    if (!session) {
      showNotification("Please login to make a purchase", "error");
      router.push("/login");
      return;
    }

    if (!product?._id) {
      showNotification("Invalid product", "error");
      return;
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
       console.error("Razorpay Key ID is missing.");
       showNotification("Payment system error. Please try again later.", "error");
       return;
    }

    try {
      const { orderId, amount } = await apiClient.createOrder({
        productId: product._id,
        variant,
      });

      const options = {
        key: keyId,
        amount,
        currency: "USD",
        name: "Iqbal Shop",
        description: `${product.name} - ${variant.type} Version`,
        order_id: orderId,
        handler: async function (response: any) {
           // Frontend Verify Logic
           try {
            showNotification("Verifying payment...", "info");
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");

            showNotification("Payment successful! Redirecting...", "success");
            router.push("/orders");
          } catch (err) {
            console.error(err);
            showNotification("Payment verification failed.", "error");
          }
        },
        prefill: {
          email: session.user.email,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      showNotification(
        error instanceof Error ? error.message : "Payment failed",
        "error"
      );
    }
  };

  const getTransformation = (variantType: ImageVariantType) => {
    const variant = IMAGE_VARIANT[variantType];
    return [
      {
        width: variant.dimensions.width.toString(),
        height: variant.dimensions.height.toString(),
        cropMode: "extract" as const,
        focus: "center",
        quality: 60,
      },
    ];
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-zinc-900" />
      </div>
    );

  if (error || !product)
    return (
      <div className="flex justify-center my-12">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <span className="font-medium">{error || "Product not found"}</span>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Image Preview Section */}
        <div className="space-y-6">
          <div
            className="relative rounded-2xl overflow-hidden bg-zinc-100 shadow-sm border border-zinc-200"
            style={{
              aspectRatio: selectedVariant
                ? `${IMAGE_VARIANT[selectedVariant.type].dimensions.width} / ${
                    IMAGE_VARIANT[selectedVariant.type].dimensions.height
                  }`
                : "1 / 1",
            }}
          >
            <IKImage
              urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
              path={product.imageUrl}
              alt={product.name}
              transformation={
                selectedVariant
                  ? getTransformation(selectedVariant.type)
                  : getTransformation("SQUARE")
              }
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {selectedVariant && (
            <div className="text-center py-2 bg-zinc-50 rounded-lg border border-zinc-100 text-sm text-zinc-500 font-medium">
              Previewing: {IMAGE_VARIANT[selectedVariant.type].label} • {IMAGE_VARIANT[selectedVariant.type].dimensions.width} x{" "}
              {IMAGE_VARIANT[selectedVariant.type].dimensions.height}px
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-4 leading-tight">{product.name}</h1>
            <p className="text-zinc-500 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Select Format
            </h2>
            
            <div className="space-y-3">
              {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.type === variant.type;
                  return (
                    <div
                        key={variant.type}
                        className={`
                            relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${isSelected 
                                ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/5" 
                                : "border-zinc-200 hover:border-zinc-300 bg-white"
                            }
                        `}
                        onClick={() => setSelectedVariant(variant)}
                    >
                        <div className="flex justify-between items-center">
                            {/* Variant Info */}
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-full ${isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                    {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900">
                                        {IMAGE_VARIANT[variant.type.toUpperCase() as keyof typeof IMAGE_VARIANT].label}
                                    </h3>
                                    <p className="text-sm text-zinc-500 mt-0.5">
                                        {IMAGE_VARIANT[variant.type.toUpperCase() as keyof typeof IMAGE_VARIANT].dimensions.width} x {IMAGE_VARIANT[variant.type.toUpperCase() as keyof typeof IMAGE_VARIANT].dimensions.height}px
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide font-medium">
                                        {variant.license} License
                                    </p>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex flex-col items-end gap-3">
                                <span className="text-2xl font-bold text-zinc-900">
                                    ${variant.price.toFixed(2)}
                                </span>
                                {isSelected && (
                                    <button
                                        className="bg-zinc-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 active:scale-95"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePurchase(variant);
                                        }}
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                  );
              })}
            </div>
          </div>

          {/* License Info Box */}
          <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-100">
            <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zinc-600" />
                License Information
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-zinc-600">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                    <strong className="text-zinc-900">Personal License:</strong> Suitable for personal projects, wallpapers, and private non-commercial use.
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-600">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                    <strong className="text-zinc-900">Commercial License:</strong> Essential for client work, advertising, merchandise, and published media.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}