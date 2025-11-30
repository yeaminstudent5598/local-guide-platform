// src/components/forms/TourForm.tsx
"use client";

import { useState } from "react";
import { useForm, Controller, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ---------------------
// Schema & TS Type
// ---------------------
const tourFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  itinerary: z.string().optional(),
  // coerce will convert string inputs to number
  tourFee: z.coerce.number().min(1, "Fee must be positive"),
  duration: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  maxGroupSize: z.coerce.number().int().min(1, "Max group size must be at least 1"),
  meetingPoint: z.string().min(5, "Meeting point is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  category: z.array(z.string()).min(1, "Select at least one category"),
  images: z.array(z.string()).min(1, "Upload at least one image"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

// ---------------------
// Static lists
// ---------------------
const CATEGORIES = [
  "Food & Drink",
  "History & Culture",
  "Art & Museums",
  "Adventure",
  "Nature & Wildlife",
  "Photography",
  "Nightlife",
  "Shopping",
  "Architecture",
  "Local Experience",
];

const COUNTRIES = [
  "Bangladesh",
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "France",
  "Germany",
  "Japan",
  "Thailand",
  "Italy",
  "Spain",
];

// ---------------------
// Props
// ---------------------
interface TourFormProps {
  // parent may pass the full record (prisma result) — keep as any to avoid tight coupling
  // we map the fields required by the form below
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
}

// ---------------------
// Component
// ---------------------
export default function TourForm({ initialData, isEdit = false }: TourFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  // categories local state (keeps UI toggles simple)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.category || []
  );

  // map initialData to the exact form shape (safe conversions)
  const mappedDefaults: Partial<TourFormData> = {
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    itinerary: initialData?.itinerary ?? "",
    tourFee:
      initialData?.tourFee !== undefined ? Number(initialData.tourFee) : 0,
    duration:
      initialData?.duration !== undefined ? Number(initialData.duration) : 1,
    maxGroupSize:
      initialData?.maxGroupSize !== undefined
        ? Number(initialData.maxGroupSize)
        : 1,
    meetingPoint: initialData?.meetingPoint ?? "",
    city: initialData?.city ?? "",
    country: initialData?.country ?? "",
    category: Array.isArray(initialData?.category) ? initialData.category : [],
    images: Array.isArray(initialData?.images) ? initialData.images : [],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TourFormData>({
    // NOTE: cast the resolver to Resolver<TourFormData> to avoid a known generic incompatibility
    resolver: zodResolver(tourFormSchema) as unknown as Resolver<TourFormData>,
    defaultValues: mappedDefaults as TourFormData,
  });

  const images = watch("images");

  // ---------------------
  // Image upload handler
  // ---------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success && data.data?.url) {
          uploadedUrls.push(data.data.url);
        }
      }
      setValue("images", [...(images || []), ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setValue("images", (images || []).filter((img) => img !== url));
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);
    setValue("category", newCategories);
  };

  // ---------------------
  // Submit handler
  // ---------------------
  const onSubmit: SubmitHandler<TourFormData> = async (data) => {
    const toastId = toast.loading(isEdit ? "Updating listing..." : "Creating listing...");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!token) {
        toast.error("You are not logged in");
        return;
      }

      const url = isEdit ? `/api/v1/listings/${initialData.id}` : "/api/v1/listings";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(isEdit ? "Listing updated!" : "Listing created!", { id: toastId });
        router.push("/dashboard/listings");
        router.refresh();
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Tour Listing" : "Create New Tour Listing"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tour Title *</Label>
            <Input id="title" {...register("title")} className={errors.title ? "border-red-500" : ""} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} rows={5} className={errors.description ? "border-red-500" : ""} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="itinerary">Itinerary (Optional)</Label>
            <Textarea id="itinerary" {...register("itinerary")} rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tourFee">Tour Fee ($) *</Label>
              <Input id="tourFee" type="number" {...register("tourFee", { valueAsNumber: true })} className={errors.tourFee ? "border-red-500" : ""} />
              {errors.tourFee && <p className="text-sm text-red-500">{errors.tourFee.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days) *</Label>
              <Input id="duration" type="number" {...register("duration", { valueAsNumber: true })} className={errors.duration ? "border-red-500" : ""} />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxGroupSize">Max Group Size *</Label>
              <Input id="maxGroupSize" type="number" {...register("maxGroupSize", { valueAsNumber: true })} className={errors.maxGroupSize ? "border-red-500" : ""} />
              {errors.maxGroupSize && <p className="text-sm text-red-500">{errors.maxGroupSize.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingPoint">Meeting Point *</Label>
            <Input id="meetingPoint" {...register("meetingPoint")} className={errors.meetingPoint ? "border-red-500" : ""} />
            {errors.meetingPoint && <p className="text-sm text-red-500">{errors.meetingPoint.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} className={errors.city ? "border-red-500" : ""} />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className={errors.country ? "border-red-500" : ""}><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categories *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedCategories.includes(category) ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-4">
            <Label>Tour Images *</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
              {/* note: input hidden, label triggers file dialog via htmlFor */}
              <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              <label htmlFor="image-upload" className="cursor-pointer">
                {uploading ? <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" /> : <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />}
                <p className="text-sm text-gray-600">{uploading ? "Uploading..." : "Click to upload images"}</p>
              </label>
            </div>

            {images && images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image src={url} alt={`Upload ${index + 1}`} width={200} height={200} className="rounded-lg object-cover w-full h-40" />
                    <button type="button" onClick={() => removeImage(url)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}

            {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting || uploading} className="w-full" size="lg">
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : (isEdit ? "Update Listing" : "Create Tour Listing")}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
