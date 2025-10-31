"use client";
import { useState } from "react";
import Logo from "./Logo";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const handleSearch = () => {
    if(search.trim() == "") return;
    router.push(`/?search=${search}`);
  };
  return (
    <nav className="flex max-sm:items-center py-2 shadow-sm shadow-gray-200 bg-white w-screen fixed z-10 left-0 top-0 flex-col sm:px-32 sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 ">
      <Logo />
      <div className="flex gap-2 items-center w-full sm:w-[444px] flex-wrap">
        <input
          type="text"
          placeholder="Search experiences"
          className="flex-1 px-4 py-2 placeholder:text-gray-500 rounded-md border border-gray-300 text-black outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-400 hover:cursor-pointer hover:bg-amber-300 text-black py-2 font-medium rounded-md px-5 text-sm"
        >
          Search
        </button>
      </div>
    </nav>
  );
};
