// Imports
import AccountPageContent from "@/components/pages/AccountPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "My Account | Bazarna",
  description: "Manage your profile, orders, and saved addresses.",
};

// Account Page
export default function AccountPage() {
  return <AccountPageContent />;
}
