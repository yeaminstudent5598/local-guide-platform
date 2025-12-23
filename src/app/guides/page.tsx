import { UserService } from "@/modules/users/user.service";
import GuideCard from "@/components/guides/GuideCard";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// এটি একটি Server Component যা সরাসরি ডাটাবেজ থেকে ডাটা নিয়ে আসবে
export default async function GuidesPage() {
  // ডাটাবেজ থেকে শুধু গাইডদের ডাটা নিয়ে আসা হচ্ছে
  // আপনার UserService.getAllUsers() মেথডটি এখানে ব্যবহার করা হচ্ছে
  const allUsers = await UserService.getAllUsers();
  const guides = allUsers?.filter((user: any) => user.role === "GUIDE") || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Meet Our <span className="text-primary">Expert Guides</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover Bangladesh through the eyes of local experts. Professional, 
              verified, and passionate storytellers ready to make your journey unforgettable.
            </p>
          </div>

          {/* Search/Filter Bar (Update-02 Requirement) */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search guides by name or expertise..." 
              className="pl-10 rounded-full bg-muted/50 border-none focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Guides Grid Layout (Update-02: 4 cards per row for desktop preferred) */}
        {guides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {guides.map((guide: any) => (
              <GuideCard 
                key={guide.id} 
                guide={{
                  id: guide.id,
                  name: guide.name,
                  profileImage: guide.profileImage,
                  expertise: guide.expertise || ["Local Expert"],
                  languages: guide.languages || ["Bengali", "English"],
                  rating: 5.0, // আপাতত স্ট্যাটিক, পরে ডাইনামিক করতে পারেন
                  totalReviews: guide._count?.listings || 0,
                  location: "Bangladesh",
                  isVerified: guide.isVerified
                }} 
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Guides Found</h3>
            <p className="text-muted-foreground mt-2">Check back later or try a different search.</p>
          </div>
        )}

      </div>
    </div>
  );
}