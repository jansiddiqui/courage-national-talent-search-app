import React from "react";
import { TeleCallerPortal } from "@/components/admin/TeleCallerPortal";

export const metadata = {
  title: "Tele-Calling Outreach Portal | CNTS Admin",
  description: "Interactive School Calling Workspace, Behavioral Q&A & Language Translator",
};

export default function TeleCallerPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <TeleCallerPortal />
    </div>
  );
}
