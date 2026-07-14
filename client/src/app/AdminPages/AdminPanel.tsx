import { LogOut, CloudUpload, Users, ChartNoAxesColumn } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPath } from "@lib/index";

function getLocation(adminId: string, label: string): string {
  if (!adminId) return `/discover`;
  return `/admin/${adminId}${getPath(label)}`;
}

const sidebarItems = [
  { label: "Upload Manga", icon: CloudUpload },
  { label: "Upload Chapter", icon: Users },
  { label: "Analytics", icon: ChartNoAxesColumn },
];

export default function AdminPanel() {
  const { adminId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-midnight p-4 shadow-md lg:min-h-screen lg:w-64">
      <div className="mb-4 flex items-center justify-between lg:mb-6">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <LogOut
          className="cursor-pointer text-white"
          onClick={() => navigate("/discover")}
        />
      </div>
      <nav className="flex gap-2 overflow-x-auto lg:block">
        {sidebarItems.map((item) => (
          <NavLink
            to={getLocation(adminId!, item.label)}
            key={item.label}
            className={({ isActive }) =>
              `flex shrink-0 items-center rounded p-2 text-white cursor-pointer lg:mb-2 ${
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
