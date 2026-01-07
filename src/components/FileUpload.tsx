"use client";
import { IKUpload } from "imagekitio-next";
import { useState } from "react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { UploadCloud, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function FileUpload({
  onSuccess,
}: {
  onSuccess: (res: IKUploadResponse) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    setUploading(false);
    setError(err.message);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    console.log("Upload Success:", res);
    onSuccess(res);
  };

  const handleuploadStart = () => {
    setUploading(true);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 group ${
          error
            ? "border-red-300 bg-red-50/50"
            : uploading
            ? "border-indigo-300 bg-indigo-50/50"
            : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-300"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {/* Icon State */}
          <div
            className={`p-3 rounded-full ${
              error
                ? "bg-red-100 text-red-600"
                : uploading
                ? "bg-indigo-100 text-indigo-600"
                : "bg-zinc-100 text-zinc-500 group-hover:bg-white group-hover:shadow-md transition-all"
            }`}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : error ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          {/* Text Instructions */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-zinc-700">
              {uploading
                ? "Uploading your masterpiece..."
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-zinc-500">
              Supported formats: JPEG, PNG, WEBP (Max 5MB)
            </p>
          </div>

          {/* Hidden Input Wrapper */}
          <div className="absolute inset-0 cursor-pointer opacity-0">
            <IKUpload
              onError={onError}
              onSuccess={handleSuccess}
              onUploadStart={handleuploadStart}
              validateFile={(file: File) => {
                const validTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                ];
                if (!validTypes.includes(file.type)) {
                  setError(
                    "Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed."
                  );
                  return false;
                }
                if (file.size > 5 * 1024 * 1024) {
                  setError("File size exceeds 5MB limit.");
                  return false;
                }
                return true;
              }}
              className="w-full h-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}