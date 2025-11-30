"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
  onRemove: (value: string) => void;
}

const ImageUpload = ({ onChange, value, onRemove }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // আপনার তৈরি করা Backend Upload API কল করা হচ্ছে
      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
        // নোট: এখানে Content-Type header দেওয়া যাবে না, browser অটোমেটিক সেট করবে
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // নতুন URL টি আগের array এর সাথে যোগ করা হচ্ছে
      onChange([...value, data.data.url]);
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          type="button"
          disabled={isUploading}
          variant="secondary"
          className="relative"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ImagePlus className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : "Upload an Image"}
          
          {/* Hidden Input */}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={onUpload}
            disabled={isUploading}
          />
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;