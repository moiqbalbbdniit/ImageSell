"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Plus, Trash2, ImageIcon, Info, DollarSign } from "lucide-react";
import { useNotification } from "./Notification";
import { IMAGE_VARIANT, ImageVariantType } from "@/types/product";
import { apiClient, ProductFormData } from "@/lib/api-client";

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      variants: [
        { type: "SQUARE" as ImageVariantType, price: 9.99, license: "personal" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("imageUrl", response.filePath);
    showNotification("Image uploaded successfully!", "success");
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");
      
      // Reset form to defaults
      setValue("name", "");
      setValue("description", "");
      setValue("imageUrl", "");
      setValue("variants", [
        { type: "SQUARE", price: 9.99, license: "personal" },
      ]);
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : "Failed to create product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white border border-zinc-200 shadow-sm rounded-xl p-8"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              New Product
            </h2>
            <p className="text-sm text-zinc-500">
              Add a new digital asset to your store.
            </p>
          </div>
          <div className="bg-zinc-100 p-2 rounded-lg text-zinc-500">
             <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Product Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g. Abstract 3D Shapes"
                className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                  errors.name ? "border-red-500 ring-red-500" : "border-zinc-200"
                }`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-900">
                Description
              </label>
              <textarea
                placeholder="Describe your product in detail..."
                className={`flex min-h-[120px] w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all ${
                  errors.description ? "border-red-500" : "border-zinc-200"
                }`}
                {...register("description", { required: "Description is required" })}
              />
               {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-900">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 hover:bg-zinc-50/50 transition-colors">
                <FileUpload onSuccess={handleUploadSuccess} />
              </div>
            </div>
          </div>

          {/* Right Column: Variants */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-500" />
                Pricing & Variants
               </h3>
               <button
                type="button"
                onClick={() =>
                  append({ type: "SQUARE", price: 9.99, license: "personal" })
                }
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 h-8 px-3"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Variant
              </button>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative group bg-zinc-50/50 border border-zinc-200 rounded-lg p-4 transition-all hover:shadow-md hover:border-zinc-300"
                >
                  {/* Remove Button (Absolute) */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="absolute -top-2 -right-2 bg-white text-zinc-400 hover:text-red-500 border border-zinc-200 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Size Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-500">
                        Format
                      </label>
                      <select
                        className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register(`variants.${index}.type`)}
                      >
                        {Object.entries(IMAGE_VARIANT).map(([key, value]) => (
                          <option key={key} value={value.type}>
                            {value.label} ({value.dimensions.width}x
                            {value.dimensions.height})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* License Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-500">
                        License
                      </label>
                      <select
                        className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register(`variants.${index}.license`)}
                      >
                        <option value="personal">Personal Use</option>
                        <option value="commercial">Commercial Use</option>
                      </select>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-1.5 md:col-span-2">
                       <label className="text-xs font-medium text-zinc-500">Price ($)</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            <DollarSign className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex h-9 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register(`variants.${index}.price`, {
                              valueAsNumber: true,
                              required: "Price is required",
                            })}
                          />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-6 border-t border-zinc-100">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-10 px-8 py-2 w-full sm:w-auto shadow-lg shadow-zinc-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}