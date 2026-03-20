import {
  LogOut,
  LayoutDashboard,
  CloudUpload,
  Library,
  Users,
  ChartNoAxesColumn,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Upload Manga", icon: CloudUpload, active: true },
  { label: "Library", icon: Library, active: false },
  { label: "Authors", icon: Users, active: false },
  { label: "Analytics", icon: ChartNoAxesColumn, active: false },
];

export function AdminPanel() {
  return (
    <div className="w-64 bg-midnight shadow-md p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <LogOut className="cursor-pointer text-white" />
      </div>
      <nav>
        {sidebarItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center p-2 mb-2 rounded cursor-pointer text-white ${
              item.active ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <item.icon className="mr-3" />
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
}
