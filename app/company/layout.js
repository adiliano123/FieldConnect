import CompanyNavbar from "../../components/CompanyNavbar";
import CompanySidebar from "../../components/CompanySidebar";

export const metadata = {
  title: {
    template: "%s | Company — FieldConnect",
    default: "Company — FieldConnect",
  },
};

export default function CompanyLayout({ children }) {
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Sticky navbar at top */}
      <CompanyNavbar />

      {/* Body — fills remaining height */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — fixed, full height, scrolls independently */}
        <div className="hidden md:flex md:flex-col sticky top-0 h-full overflow-y-auto shrink-0">
          <CompanySidebar />
        </div>

        {/* Main content — scrollable */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
