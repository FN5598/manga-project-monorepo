import {
  LogOut,
  CloudUpload,
  Library,
  Users,
  ChartNoAxesColumn,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPath } from "../..";

function getLocation(adminId: string, label: string): string {
  if (!adminId) return `/discover`;
  return `/admin/${adminId}${getPath(label)}`;
}

const sidebarItems = [
  { label: "Upload Manga", icon: CloudUpload },
  { label: "Library", icon: Library },
  { label: "Upload Chapter", icon: Users },
  { label: "Analytics", icon: ChartNoAxesColumn },
];

export function AdminPanel() {
  const { adminId } = useParams();

  return (
    <div className="w-64 bg-midnight shadow-md p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <LogOut className="cursor-pointer text-white" />
      </div>
      <nav>
        {sidebarItems.map((item) => (
          <NavLink
            to={getLocation(adminId!, item.label)}
            key={item.label}
            className={({ isActive }) =>
              `flex items-center p-2 mb-2 rounded cursor-pointer text-white ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <item.icon className="mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
