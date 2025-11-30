import TourForm from "@/components/forms/TourForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Listing</h2>
        <p className="text-muted-foreground">
          Add a new tour to attract travelers.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
          <CardDescription>
            Fill in the details about your tour.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TourForm />
        </CardContent>
      </Card>
    </div>
  );
}