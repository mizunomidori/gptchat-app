
import Link from "next/link";
import { headerTitle } from '../constants/constants';

export default function Header() {
  return (
    <header className="border-b border-gray-500">
      <nav className="flex justify-center p-2">
        <div className="flex">
          <Link href={"/"} className="p-2 text-xs font-semibold md:text-xl">
            {headerTitle}
          </Link>
        </div>
      </nav>
    </header>
  );
}
