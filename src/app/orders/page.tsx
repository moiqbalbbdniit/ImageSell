"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Download, Image as ImageIcon } from "lucide-react";
import { IKImage } from "imagekitio-next";

import { IMAGE_VARIANT } from "@/types/product";
import { Order } from "@/types/order";
import { apiClient } from "@/lib/api-client";

export default function OrdersPage() {
  const { status } = useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Orders ---------------- */
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchOrders = async () => {
      try {
        const response = await apiClient.getUserOrders();

        if (Array.isArray(response)) {
          setOrders(response);
        } else if (response && typeof response === "object" && Array.isArray((response as any)?.orders)) {
          setOrders((response as any).orders);
        } else {
          console.error("Invalid orders response:", response);
          setOrders([]);
        }
      } catch (err) {
        console.error("Fetch orders failed:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  /* ---------------- Empty ---------------- */
  if (!orders.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ImageIcon className="mx-auto mb-4 w-14 h-14 text-base-content/40" />
        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
        <p className="text-base-content/70">
          Your purchased images will appear here.
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10">My Orders</h1>

      <div className="grid gap-6">
        {orders.map((order) => {
          const variantKey =
            order.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANT;

          const { width, height } =
            IMAGE_VARIANT[variantKey].dimensions;

          const product = order.productId as any;

          const statusStyles = {
            completed: "bg-green-500/15 text-green-400",
            failed: "bg-red-500/15 text-red-400",
            pending: "bg-yellow-500/15 text-yellow-400",
          };

          return (
            <div
              key={order._id?.toString()}
              className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* -------- Image -------- */}
                <div
                  className="relative rounded-xl overflow-hidden bg-base-200 shrink-0"
                  style={{
                    width: 220,
                    aspectRatio: `${width} / ${height}`,
                  }}
                >
                  <IKImage
                    urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                    path={product.imageUrl}
                    alt={product.name}
                    transformation={[
                      {
                        width: width.toString(),
                        height: height.toString(),
                        quality: 60,
                        cropMode: "extract",
                        focus: "center",
                      },
                    ]}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* -------- Details -------- */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">
                          Order #{order._id?.toString().slice(-6)}
                        </h2>
                        <p className="text-base-content/60 text-sm">
                          {product.name}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-base-content/70">
                      <p>
                        Resolution: {width} × {height}px
                      </p>
                      <p>
                        License:{" "}
                        <span className="capitalize">
                          {order.variant.license}
                        </span>
                      </p>
                      <p>
                        Purchased on:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* -------- Price + Action -------- */}
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-2xl font-bold">
                      ${order.amount.toFixed(2)}
                    </p>

                    {order.status === "completed" && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${width},h-${height},cm-extract,fo-center/${product.imageUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-primary-content font-medium hover:opacity-90 transition"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
