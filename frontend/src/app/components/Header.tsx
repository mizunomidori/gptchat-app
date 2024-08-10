
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <nav className="flex justify-between p-2">
        <div className="flex">
          <Link href={"/"} className="p-2 text-xs font-semibold md:text-xl">
            🧠RAG AI Chat App
          </Link>
        </div>
      </nav>
    </header>
  );
}
