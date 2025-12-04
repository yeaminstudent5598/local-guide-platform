"use client";

import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Ensure you have shadcn calendar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 1. Zod Schema
const tourFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  itinerary: z.string().optional().or(z.literal("")),
  tourFee: z.coerce.number().min(0, "Price must be a positive number"),
  duration: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  maxGroupSize: z.coerce.number().int().min(1, "Group size must be at least 1"),
  meetingPoint: z.string().min(3, "Meeting point is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  category: z.array(z.string()).min(1, "Select at least one category"),
  images: z.array(z.string()).min(1, "Upload at least one image"),
  // ✅ New Field: Unavailable Dates
  unavailableDates: z.array(z.date()).optional().default([]),
});

type TourFormData = z.infer<typeof tourFormSchema>;

const CATEGORIES = [
  "Food & Drink", "History & Culture", "Art & Museums", "Adventure",
  "Nature & Wildlife", "Photography", "Nightlife", "Shopping",
  "Architecture", "Local Experience",
];

const COUNTRIES = [
  "Bangladesh", "India", "USA", "UK", "Canada", "Australia",
  "France", "Germany", "Japan", "Thailand", "Italy", "Spain",
];

interface TourFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any; 
  isEdit?: boolean;
}

export default function TourForm({ initialData, isEdit = false }: TourFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.category || []
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      tourFee: Number(initialData.tourFee),
      duration: Number(initialData.duration),
      maxGroupSize: Number(initialData.maxGroupSize),
      unavailableDates: initialData.unavailableDates?.map((d: string) => new Date(d)) || [],
    } : {
      title: "",
      description: "",
      itinerary: "",
      tourFee: 0,
      duration: 1,
      maxGroupSize: 1,
      meetingPoint: "",
      city: "",
      country: "",
      category: [],
      images: [],
      unavailableDates: [],
    },
  });

  const images = watch("images");

  // Image Upload Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading("Uploading images...");

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/v1/upload", { method: "POST", body: formData });
        const data = await response.json();

        if (data.success && data.data.url) {
          uploadedUrls.push(data.data.url);
        }
      }
      setValue("images", [...images, ...uploadedUrls]);
      toast.success("Images uploaded", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setValue("images", images.filter((img) => img !== url));
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setValue("category", newCategories);
  };

  // Submit Handler
  const onSubmit: SubmitHandler<TourFormData> = async (data) => {
    const toastId = toast.loading(isEdit ? "Updating listing..." : "Creating listing...");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You are not logged in", { id: toastId });
        return;
      }

      const url = isEdit ? `/api/v1/listings/${initialData.id}` : "/api/v1/listings";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Tour Listing" : "Create New Tour Listing"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Basic Fields */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} className={errors.title ? "border-red-500" : ""} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
             <Label htmlFor="description">Description *</Label>
             <Textarea id="description" {...register("description")} rows={5} className={errors.description ? "border-red-500" : ""} />
             {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
             <Label>Itinerary (Optional)</Label>
             <Textarea {...register("itinerary")} rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
               <Label>Price (BDT) *</Label>
               <Input type="number" {...register("tourFee")} className={errors.tourFee ? "border-red-500" : ""} />
               {errors.tourFee && <p className="text-red-500 text-sm">{errors.tourFee.message}</p>}
            </div>
            <div className="space-y-2">
               <Label>Duration (Days) *</Label>
               <Input type="number" {...register("duration")} className={errors.duration ? "border-red-500" : ""} />
               {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
            </div>
            <div className="space-y-2">
               <Label>Max Group Size *</Label>
               <Input type="number" {...register("maxGroupSize")} className={errors.maxGroupSize ? "border-red-500" : ""} />
               {errors.maxGroupSize && <p className="text-red-500 text-sm">{errors.maxGroupSize.message}</p>}
            </div>
          </div>

          {/* ✅ AVAILABILITY CALENDAR (New Feature) */}
          <div className="space-y-2">
            <Label>Block Unavailable Dates</Label>
            <Controller
              control={control}
              name="unavailableDates"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value && field.value.length > 0 ? (
                        `${field.value.length} dates blocked`
                      ) : (
                        <span>Pick dates to block</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="multiple"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <p className="text-xs text-muted-foreground">Tourists won't be able to book these dates.</p>
          </div>

          <div className="space-y-2">
            <Label>Meeting Point *</Label>
            <Input {...register("meetingPoint")} className={errors.meetingPoint ? "border-red-500" : ""} />
            {errors.meetingPoint && <p className="text-red-500 text-sm">{errors.meetingPoint.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>City *</Label>
                <Input {...register("city")} className={errors.city ? "border-red-500" : ""} />
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
             </div>
             <div className="space-y-2">
                <Label>Country *</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <SelectTrigger className={errors.country ? "border-red-500" : ""}><SelectValue placeholder="Select country" /></SelectTrigger>
                       <SelectContent>
                          {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                       </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
             </div>
          </div>

          <div className="space-y-2">
            <Label>Categories *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategories.includes(cat) ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          <div className="space-y-4">
            <Label>Images *</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
               <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
               <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
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
            {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting || uploading} className="w-full" size="lg">
             {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : (isEdit ? "Update Listing" : "Create Tour Listing")}
          </Button>

        </CardContent>
      </Card>
    </form>
  );
}