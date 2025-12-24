"use client";

import { NavigationProvider } from "@/context/NavigationContext";
import { DataProvider } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/AppLayout";

export default function HomePage() {
  return (
    <DataProvider>
      <NavigationProvider>
        <AppLayout />
      </NavigationProvider>
    </DataProvider>
  );
}
