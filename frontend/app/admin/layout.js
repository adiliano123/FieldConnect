import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

export const metadata = {
  title: {
    template: "%s | Admin — FieldConnect",
    default: "Admin — FieldConnect",
  },
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Sticky navbar at top */}
      <AdminNavbar />

      {/* Body — fills remaining height */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — fixed, full height, scrolls independently */}
        <div className="hidden md:flex md:flex-col sticky top-0 h-full overflow-y-auto shrink-0">
          <AdminSidebar />
        </div>

        {/* Main content — scrollable */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
