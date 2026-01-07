"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Download, PackageOpen, Calendar, Clock } from "lucide-react";
import { IKImage } from "imagekitio-next";
import { IMAGE_VARIANT } from "@/types/product";
import { Order } from "@/types/order";
import { apiClient } from "@/lib/api-client";

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchOrders = async () => {
      try {
        const response = await apiClient.getUserOrders();
        // Handle both direct array and wrapped response formats
        if (Array.isArray(response)) {
          setOrders(response);
        } else if (response && typeof response === "object" && Array.isArray((response as any)?.orders)) {
          setOrders((response as any).orders);
        } else {
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900" />
        <p className="text-zinc-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-zinc-100 p-6 rounded-full mb-6">
          <PackageOpen className="w-12 h-12 text-zinc-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">No orders yet</h2>
        <p className="text-zinc-500 max-w-sm mb-8">
          You haven't purchased any digital assets yet. Visit the store to find something amazing.
        </p>
        <a 
          href="/" 
          className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-zinc-800 transition-all active:scale-95"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">My Orders</h1>
          <p className="text-zinc-500 mt-1">Manage your purchases and downloads</p>
        </div>
        <div className="hidden sm:block text-sm font-medium text-zinc-500 bg-zinc-100 px-4 py-2 rounded-full">
          Total Orders: <span className="text-zinc-900">{orders.length}</span>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const variantKey = order.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANT;
          const { width, height } = IMAGE_VARIANT[variantKey]?.dimensions || { width: 0, height: 0 };
          const product = order.productId as any;

          return (
            <div
              key={order._id?.toString()}
              className="group bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                
                {/* Image Thumbnail */}
                <div className="relative w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100 shrink-0">
                  {product?.imageUrl && (
                    <IKImage
                      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                      path={product.imageUrl}
                      alt={product.name || "Product Image"}
                      transformation={[{
                        width: "400",
                        height: "300",
                        cropMode: "extract",
                        focus: "center"
                      }]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Order Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">
                          {product?.name || "Unknown Product"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wide">
                          <span className="flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                             {order.variant.type} Version
                          </span>
                          <span className="flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                             {order.variant.license} License
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-1.5 border ${getStatusStyles(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-y-1 gap-x-8 text-sm text-zinc-600 my-4 p-3 bg-zinc-50/50 rounded-lg border border-zinc-100">
                      <div className="flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                         <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5 text-zinc-400" />
                         <span>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="col-span-2 text-xs text-zinc-400 mt-1 pt-1 border-t border-zinc-200">
                        ID: {order._id?.toString()}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xl font-bold text-zinc-900">
                      ${order.amount.toFixed(2)}
                    </div>

                    {order.status === "completed" && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${width},h-${height},cm-extract,fo-center/${product.imageUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        Download Asset
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

// Helper for Styles
function getStatusStyles(status: string) {
  switch (status) {
    case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "failed": return "bg-red-50 text-red-700 border-red-100";
    default: return "bg-amber-50 text-amber-700 border-amber-100";
  }
}

// Helper for Icons (Optional visual flair)
function getStatusIcon(status: string) {
    return <span className={`w-1.5 h-1.5 rounded-full ${status === 'completed' ? 'bg-emerald-500' : status === 'failed' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
}