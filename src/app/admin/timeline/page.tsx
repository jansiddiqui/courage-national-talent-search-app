import AdminTimelineManager from "@/components/admin/AdminTimelineManager";

export const metadata = {
  title: "CNTS Timeline Command Center | Admin Panel",
  description: "Manage annual CNTS editions, operational event milestones, release status gates, and candidate schedules."
};

export default function AdminTimelinePage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <AdminTimelineManager />
    </div>
  );
}
