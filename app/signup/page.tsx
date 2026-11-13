import { Suspense } from "react";
import { AuthPageContent } from "@/components/auth/AuthPageContent";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[65vh]" />}>
      <AuthPageContent mode="signup" />
    </Suspense>
  );
}
