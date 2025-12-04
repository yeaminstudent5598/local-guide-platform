import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    profileImage?: string | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border-none shadow-none bg-slate-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.user.profileImage || "/placeholder-avatar.jpg"} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm">{review.user.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}