import { Suspense } from "react";
import OrdersPageContent from "@/components/pages/OrdersPageContent";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <OrdersPageContent />
    </Suspense>
  );
}
