"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useNotification } from "./Notification";
import { IMAGE_VARIANT, ImageVariantType } from "@/types/product";
import { apiClient, ProductFormData } from "@/lib/api-client";

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      variants: [{ type: "SQUARE" as ImageVariantType, price: 9.99, license: "personal" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("imageUrl", response.filePath);
    showNotification("Image uploaded successfully!", "success");
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");
      setValue("name", "");
      setValue("description", "");
      setValue("imageUrl", "");
      setValue("variants", [{ type: "SQUARE", price: 9.99, license: "personal" }]);
    } catch (err) {
      showNotification(err instanceof Error ? err.message : "Failed to create product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {/* Product Name */}
      <div>
        <label className="block font-medium mb-1">Product Name</label>
        <input type="text" className={`w-full ${errors.name ? "border-red-500" : "border-gray-300"}`} {...register("name", { required: true })} />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea className={`w-full h-24 ${errors.description ? "border-red-500" : "border-gray-300"}`} {...register("description", { required: true })} />
      </div>

      {/* File Upload */}
      <div>
        <label className="block font-medium mb-1">Product Image</label>
        <FileUpload onSuccess={handleUploadSuccess} />
      </div>

      <div className="border-t border-gray-200 pt-4 font-semibold text-gray-700">Image Variants</div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border border-gray-200 rounded-md flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block mb-1">Size & Aspect Ratio</label>
            <select className="w-full border border-gray-300 rounded-md px-2 py-1" {...register(`variants.${index}.type`)}>
              {Object.entries(IMAGE_VARIANT).map(([key, value]) => (
                <option key={key} value={value.type}>
                  {value.label} ({value.dimensions.width}x{value.dimensions.height})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1">License</label>
            <select className="w-full border border-gray-300 rounded-md px-2 py-1" {...register(`variants.${index}.license`)}>
              <option value="personal">Personal Use</option>
              <option value="commercial">Commercial Use</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1">Price ($)</label>
            <input type="number" step="0.01" min="0" className="w-full border border-gray-300 rounded-md px-2 py-1" {...register(`variants.${index}.price`, { valueAsNumber: true, required: true })} />
          </div>

          <button type="button" className="text-red-500" onClick={() => remove(index)} disabled={fields.length === 1}>
            <Trash2 />
          </button>
        </div>
      ))}

      <button type="button" className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-gray-700" onClick={() => append({ type: "SQUARE", price: 9.99, license: "personal" })}>
        <Plus /> Add Variant
      </button>

      <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md flex justify-center items-center gap-2" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Product"}
      </button>
    </form>
  );
}
