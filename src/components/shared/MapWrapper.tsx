"use client"; // 👈 এটি অবশ্যই থাকতে হবে

import dynamic from "next/dynamic";

// এখানে dynamic import এবং ssr: false ব্যবহার করা নিরাপদ
const Map = dynamic(() => import("@/components/shared/Map"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 rounded-xl animate-pulse" />
});

interface MapWrapperProps {
  center: [number, number];
  popupText: string;
}

export default function MapWrapper({ center, popupText }: MapWrapperProps) {
  return <Map center={center} popupText={popupText} />;
}