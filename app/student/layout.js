import StudentNavbar from "../../components/StudentNavbar";
import StudentSidebar from "../../components/StudentSidebar";

export const metadata = {
  title: {
    template: "%s | Student — FieldConnect",
    default: "Student — FieldConnect",
  },
};

export default function StudentLayout({ children }) {
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Sticky navbar at top */}
      <StudentNavbar />

      {/* Body — fills remaining height, no overflow on the row itself */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — sticky, full height, scrolls independently */}
        <div className="hidden md:flex md:flex-col sticky top-0 h-full overflow-y-auto shrink-0">
          <StudentSidebar />
        </div>

        {/* Main content — scrollable */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
