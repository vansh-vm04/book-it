"use client";
import Back from "@/components/Back";
import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";
import { Experience, Slot } from "@/types/Experiences";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Details() {
  const [experience, setExperience] = useState<Experience | null>(null);
  const { id } = useParams();
  const { data } = useFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/experiences/${id}`
  );
  const uniqueDates = [...new Set(experience?.slots?.map((s) => s.date))];
  const [selectedDate, setSelectedDate] = useState(uniqueDates[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setloading] = useState(true)
  const slotsForDate = experience?.slots?.filter(
    (s) => s.date === selectedDate
  );
  const selectedSlot: Slot[] =
    experience?.slots?.filter((s) => {
      if (s.date == selectedDate && s.time == selectedTime) {
        return s;
      }
    }) || [];
  const router = useRouter();
  const tax = Math.round(((selectedSlot?.[0]?.price * qty) / 100) * 18) || 0;
  const total = selectedSlot ? selectedSlot[0]?.price * qty + tax : 899;

  useEffect(() => {
    if (experience) {
      setSelectedDate(experience?.slots?.[0]?.date);
      setSelectedTime(experience?.slots?.[0]?.time);
    }
  }, [experience]);

  useEffect(() => {
    if (data?.data) {
      setExperience(data.data);
      setloading(false)
    }
  }, [data, selectedTime]);

  const checkoutPage = () => {
    setloading(true)
    router.push(
      `/checkout?experienceId=${experience?._id}&date=${selectedDate}&time=${selectedTime}&qty=${qty}`
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-28 sm:px-8 md:px-12 lg:px-32 max-sm:pt-44 py-8 font-sans">
      <div
        onClick={() => router.push("/")}
        className="flex mb-6 w-fit hover:cursor-pointer items-center gap-2"
      >
        <Back />
        <h2 className="text-lg font-medium text-black">Details</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {experience?.image && (
            <Image
              src={experience?.image}
              alt={experience?.title}
              width={800}
              height={200}
              className="rounded-xl max-h-[344px] overflow-clip object-cover mb-6"
            />
          )}
          <h2 className="text-2xl text-black font-semibold mb-2">
            {experience?.title}
          </h2>
          <p className="text-gray-600 mb-6">{experience?.description}</p>

          <p className="text-sm text-black font-medium mb-2">Choose date</p>
          <div className="flex gap-2 mb-6 flex-wrap">
            {uniqueDates?.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedTime("");
                }}
                className={`px-4 py-1.5 rounded-md text-sm ${
                  selectedDate === d
                    ? "bg-btn text-black"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {new Date(d).toDateString().slice(4, 10)}
              </button>
            ))}
          </div>

          <p className="text-sm font-medium mb-2 text-black">Choose time</p>
          <div className="flex gap-2 flex-wrap">
            {slotsForDate?.map((s, i) => {
              const seatsLeft = s.capacity - s.bookedCount;
              const soldOut = seatsLeft <= 0;
              return (
                <button
                  key={i}
                  disabled={soldOut}
                  onClick={() => setSelectedTime(s.time)}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    soldOut
                      ? "bg-gray-100 text-gray-400"
                      : selectedTime === s.time
                      ? "bg-btn text-black"
                      : "border text-gray-700"
                  }`}
                >
                  {s.time}
                  {seatsLeft > 0 && (
                    <span className="text-red-500 text-xs ml-1">
                      {seatsLeft} left
                    </span>
                  )}
                  {soldOut && " Sold out"}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            All times are in IST (GMT +5:30)
          </p>

          <div className="mt-8">
            <p className="text-sm font-medium mb-2 text-black">About</p>
            <p className="text-gray-500 bg-gray-100 rounded-md px-3 py-2 text-sm">
              Scenic routes, trained guides, and safety briefing. Minimum age
              10.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 p-5 rounded-xl h-fit">
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Starts at</p>
            <p className="text-black">₹{selectedSlot?.[0]?.price ?? "--"}</p>
          </div>
          <div className="flex justify-between mb-2 items-center">
            <p className="text-gray-500">Quantity</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="border text-black rounded px-2"
              >
                -
              </button>
              <span className="text-black">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="border text-black rounded px-2"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between mb-1">
            <p className="text-gray-500">Subtotal</p>
            <p className="text-black">
              ₹{selectedSlot?.[0]?.price * qty || "--"}
            </p>
          </div>
          <div className="flex justify-between mb-3">
            <p className="text-gray-500">Taxes</p>
            <p className="text-black">₹{tax}</p>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-semibold mb-4">
            <p className="text-black">Total</p>
            <p className="text-black">₹{total || "--"}</p>
          </div>
          <button
            disabled={!selectedDate || !selectedTime}
            onClick={checkoutPage}
            className={`w-full ${
              selectedDate && selectedTime
                ? "bg-btn text-black hover:cursor-pointer"
                : "bg-gray-200 text-gray-500 hover:cursor-not-allowed"
            } font-medium py-2 rounded-md`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
