```bash

local-guide-hub/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── images/
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── explore/
│   │   │   │   └── page.tsx
│   │   │   ├── tours/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── guides/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── how-it-works/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── bookings/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── listings/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx
│   │   │   │   ├── reviews/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── earnings/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── availability/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── listings/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── bookings/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reviews/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── me/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── listings/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── search/
│   │   │   │   │   └── route.ts
│   │   │   │   └── featured/
│   │   │   │       └── route.ts
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── accept/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── reject/
│   │   │   │       │   └── route.ts
│   │   │   │       └── cancel/
│   │   │   │           └── route.ts
│   │   │   ├── reviews/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── payments/
│   │   │   │   ├── create-intent/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── confirm/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   └── admin/
│   │   │       ├── users/
│   │   │       │   └── route.ts
│   │   │       ├── listings/
│   │   │       │   └── route.ts
│   │   │       └── stats/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── skeleton.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedTours.tsx
│   │   │   ├── TopGuides.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── PopularDestinations.tsx
│   │   │   └── CTASection.tsx
│   │   ├── tours/
│   │   │   ├── TourCard.tsx
│   │   │   ├── TourGrid.tsx
│   │   │   ├── TourDetails.tsx
│   │   │   ├── BookingWidget.tsx
│   │   │   └── TourFilters.tsx
│   │   ├── guides/
│   │   │   ├── GuideCard.tsx
│   │   │   ├── GuideProfile.tsx
│   │   │   └── GuideStats.tsx
│   │   ├── bookings/
│   │   │   ├── BookingCard.tsx
│   │   │   ├── BookingList.tsx
│   │   │   ├── BookingStatus.tsx
│   │   │   └── BookingActions.tsx
│   │   ├── reviews/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   └── RatingStars.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── TourForm.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   └── SearchForm.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── UpcomingBookings.tsx
│   │   │   ├── RecentReviews.tsx
│   │   │   ├── EarningsChart.tsx
│   │   │   └── AvailabilityCalendar.tsx
│   │   ├── admin/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── ListingManagement.tsx
│   │   │   ├── BookingManagement.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   ├── shared/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── providers/
│   │       ├── AuthProvider.tsx
│   │       ├── QueryProvider.tsx
│   │       └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   ├── cloudinary.ts
│   │   ├── stripe.ts
│   │   ├── email.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBookings.ts
│   │   ├── useListings.ts
│   │   ├── useReviews.ts
│   │   └── useToast.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── listing.types.ts
│   │   ├── booking.types.ts
│   │   ├── review.types.ts
│   │   └── payment.types.ts
│   ├── validations/
│   │   ├── auth.schema.ts
│   │   ├── user.schema.ts
│   │   ├── listing.schema.ts
│   │   ├── booking.schema.ts
│   │   └── review.schema.ts
│   ├── constants/
│   │   ├── categories.ts
│   │   ├── languages.ts
│   │   ├── cities.ts
│   │   └── routes.ts
│   └── middleware.ts
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── components.json
└── README.md


```