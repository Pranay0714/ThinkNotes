import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-gradient-to-r from-[#050406] via-[#1b1020] to-[#251422] border-b-2 border-[#D4AF37] shadow-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-mono tracking-tight text-orange-300">
            ThinkNotes
          </h1>
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-primary bg-orange-300 border-orange-300 hover:bg-orange-400 hover:border-orange-400">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
