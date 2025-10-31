"use client";
import Back from "@/components/Back";
import Loading from "@/components/Loading";
import { Experience, Slot } from "@/types/Experiences";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Checkout() {
  const [slotIdx, setslotIdx] = useState(0);
  const [disable, setDisable] = useState(false);
  const [promoApplied, setpromoApplied] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("experienceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const qty = Number(searchParams.get("qty"));
  const [loading, setloading] = useState(false)
  const [selectedSlot, setselectedSlot] = useState<Slot[]>([]);
  const [tax, settax] = useState(0)
  const [subTotal, setsubTotal] = useState(0);
  const [total, settotal] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    promo: "",
    agree: false,
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const fetchExp = async ()=>{
    try {
      setloading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/experiences/${id}`);
      setExperience(res.data.data)
      setloading(false);
    } catch {
      console.log("Error")
    }
  }

  useEffect(()=>{
    fetchExp();
  },[])

  useEffect(() => {
    if (experience) {
    const slot:Slot[] = experience?.slots?.filter((s, i) => {
      if (s.date == date && s.time == time) {
        setslotIdx(i);
        return s;
      }
    }) || [];
    setselectedSlot(slot);
    settax(Math.round(((selectedSlot?.[0]?.price * qty) / 100) * 18))
    }
  }, [experience,subTotal]);

  useEffect(()=>{
    settotal(selectedSlot?.[0]?.price * qty + tax);
    setsubTotal(selectedSlot?.[0]?.price * qty)
  },[selectedSlot])

  const applyPromo = async () => {
    if(!form.promo) {
      setMessage("Enter a promo code please")
      return;
    }
    try {
      setDisable(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/promo/validate`,
        {
          code: form.promo,
        }
      );

      if (!response.data.ok) {
        setMessage("Invalid promo code, try another");
        return;
      }
      console.log(response.data);
      const discount = response.data.data.discountValue;
      settotal(total - discount);
      setpromoApplied(true);
      setMessage(`Discount of ₹${discount} applied`);
    } catch {
      setMessage("Invalid promo code, try another");
    } finally {
      setDisable(false);
    }
  };

  const removePromo = () => {
    settotal(subTotal + tax);
    setpromoApplied(false);
  };

  const handleConfirm = async (e:FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/booking`,
        {
          experienceId: experience?._id,
          slotIndex: slotIdx,
          name: form.name,
          email: form.email,
          promoCode: form.promo || null,
          quantity: qty,
          totalAmount: total,
        }
      );
      if(!response.data.ok){
        //add toast
        return;
      }

      router.push(`/confirmation?refId=${response.data.data.refId}`)
    } catch {
      //add toast
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-28 max-sm:pt-44 bg-white px-4 sm:px-8 md:px-12 lg:px-32 py-8 font-sans">
      <div className="flex mb-6 items-center gap-2">
        <Back />
        <h2 className="text-lg font-medium text-black">Checkout</h2>
      </div>
      <form
        onSubmit={(e:FormEvent)=>handleConfirm(e)}
        className="flex max-sm:flex-wrap gap-8 max-md:gap-4"
      >
        <div className="bg-gray-100 max-md:w-full w-2/3 p-6 h-fit rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full border-none bg-gray-200 rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Your email"
                className="w-full border-none bg-gray-200 rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 ">
            <input
              disabled={promoApplied}
              type="text"
              value={form.promo}
              onChange={(e) => setForm({ ...form, promo: e.target.value })}
              placeholder="Promo code"
              className="w-full border-none bg-gray-200 rounded-md px-3 py-2 text-sm outline-none"
            />
            {promoApplied ? (
              <button
                disabled={disable}
                onClick={removePromo}
                className="bg-red-500 hover:cursor-pointer hover:bg-red-800 text-white text-sm px-5 rounded-md"
              >
                Remove
              </button>
            ) : (
              <button
                disabled={disable}
                onClick={applyPromo}
                className="bg-black hover:cursor-pointer hover:bg-gray-800 text-white text-sm px-5 rounded-md"
              >
                Apply
              </button>
            )}
          </div>
          {message && (
            <span className="text-sm  text-yellow-500">{message}</span>
          )}

          <div className="flex items-center mt-4 gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            />
            <label>I agree to the terms and safety policy</label>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl max-md:w-full w-1/3 h-fit">
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Experience</p>
            <p>{experience?.title}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Date</p>
            <p>{date}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Time</p>
            <p>{time}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Qty</p>
            <p>{qty}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Subtotal</p>
            <p>₹{subTotal}</p>
          </div>
          <div className="flex justify-between mb-3">
            <p className="text-gray-500">Taxes</p>
            <p>₹{tax}</p>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-semibold mb-4">
            <p>Total</p>
            <p>₹{total}</p>
          </div>
          <button
            type="submit"
            disabled={!form.agree || !form.name || !form.email || disable}
            className={`w-full py-2 rounded-md font-medium ${
              form.agree && form.name && form.email
                ? "bg-yellow-400 text-black hover:bg-amber-300 hover:cursor-pointer"
                : "bg-gray-200 text-gray-400 hover:cursor-not-allowed"
            }`}
          >
            Pay and Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
