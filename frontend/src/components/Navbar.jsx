import { DatabaseIcon, FileTextIcon } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          {/* Brand - now links to home */}
          <Link to="/" className="text-3xl font-bold text-primary font-serif tracking-tighter hover:opacity-80 transition">
            Product Database
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link to="/databases" className="btn btn-ghost">
              <DatabaseIcon className="size-5" />
              <span>Databases</span>
            </Link>
            <Link to="/schemas" className="btn btn-ghost">
              <FileTextIcon className="size-5" />
              <span>Schemas</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
