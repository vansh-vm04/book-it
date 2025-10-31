"use client";
import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";
import { Experience } from "@/types/Experiences";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  const search = params.get("search") || "";
  const { data, loading } = useFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/experiences`
  );
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    if (data.data) {
      const exp = data?.data;
      setExperiences(exp);
    }
  }, [data]);

  const filtered = experiences.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const viewDetails = (expId:string)=>{
    router.push(`/details/${expId}`)
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-white px-4 py-8 pt-32 sm:px-8 md:px-12 lg:px-20 max-sm:pt-44 font-sans">
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8">
        {filtered.map((exp, i) => (
          <div
            key={i}
            className="bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="relative w-full h-48">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover"
              />
            </div>
            <div className=" flex flex-col p-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-md text-black font-semibold">
                  {exp.title}
                </h2>
                <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">
                  {exp.location}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Curated small-group experience. Certified guide. Safety first
                with gear included.
              </p>
              <div className="flex mt-auto items-center justify-between ">
                <p className="text-sm text-gray-900">
                  From{" "}
                  <span className="font-semibold text-lg">
                    ₹{exp?.slots[0]?.price ?? "999"}
                  </span>
                </p>
                <button onClick={()=>viewDetails(exp?._id)} className="bg-yellow-400 hover:bg-amber-300 hover:cursor-pointer text-black text-sm font-medium px-3 py-1.5 rounded-md">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
