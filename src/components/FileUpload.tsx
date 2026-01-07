"use client"
import { IKUpload } from "imagekitio-next"
import { useState } from "react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

export default function FileUpload(
    {onSuccess}:{onSuccess: (res: IKUploadResponse) => void}
) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const onError = (err: {message: string}) => {
        setUploading(false);
        setError(err.message);
    }

    const handleSuccess = (res: IKUploadResponse) => {
        setUploading(false);
        setError(null);
        console.log("Upload Success:", res);
        onSuccess(res);
    }

    const handleuploadStart = () => {
        setUploading(true);
        setError(null);
    }

  return (
    <div className="space-y-2">
      <IKUpload 
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleuploadStart}
        validateFile={(file: File) => {
            const validTypes = ["image/jpeg", "image/png", "image/jpg","image/webp"];
            if (!validTypes.includes(file.type)) {
                setError("Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.");
                return false;
            }

            if(file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("File size exceeds 5MB limit.");
                return false;
            }

            return true
        }}
      /> 
      
      {uploading && <p className="text-blue-500">Uploading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

    </div>
  )
}