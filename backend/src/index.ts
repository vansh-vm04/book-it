import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Experience } from "./models/Experience.js";
import { Booking, Promo } from "./models/Booking.js";
import { connectDB } from "./config/db.js";
import { generateRefId } from "./utils/refGenerater.js";
dotenv.config();

connectDB();
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.post("/api/experiences", async (req, res) => {
  try {
    const { title, description, image, location } = req.body;
    if (!title || !image)
      return res.status(400).json({ ok: false, message: "Missing fields" });
    const exp = await Experience.create({
      title,
      description,
      image,
      location,
      slots: [],
    });
    res.status(201).json({ ok: true, data: exp });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

app.post("/api/experiences/:id/slots", async (req, res) => {
  try {
    const { date, time, capacity, price } = req.body;
    const exp = await Experience.findById(req.params.id);
    if (!exp)
      return res
        .status(404)
        .json({ ok: false, message: "Experience not found" });
    exp.slots.push({ date, time, capacity, price, bookedCount: 0 });
    await exp.save();
    res.status(201).json({ ok: true, data: exp });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

app.get("/api/experiences", async (req, res) => {
  try {
    const search = req.query.search as string;
    const filter = search ? { title: { $regex: search, $options: "i" } } : {};
    const data = await Experience.find(filter);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

app.get("/api/experiences/:id", async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ ok: false });
    res.json({ ok: true, data: exp });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

app.post("/api/promo/validate", async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await Promo.findOne({ code: code?.toUpperCase() });
    if (!promo)
      return res.status(404).json({ ok: false, message: "Invalid promo" });
    res.json({ ok: true, data: promo });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

app.post("/api/booking", async (req, res) => {
  try {
    const {
      experienceId,
      slotIndex,
      name,
      email,
      promoCode,
      quantity,
      totalAmount,
    } = req.body;
    const exp = await Experience.findById(experienceId);
    if (!exp) return res.status(404).json({ ok: false });
    const slot = exp.slots[slotIndex];
    if (!slot)
      return res.status(400).json({ ok: false, message: "Invalid slot" });
    const availableSeats = slot.capacity - slot.bookedCount;
    if (availableSeats < quantity) {
      return res.status(409).json({
        ok: false,
        message: "Not enough seats available",
        availableSeats,
      });
    }

    await Experience.findOneAndUpdate(
      {
        _id: experienceId,
        [`slots.${slotIndex}.bookedCount`]: { $lte: slot.capacity - quantity },
      },
      {
        $inc: { [`slots.${slotIndex}.bookedCount`]: quantity },
      },
      { new: true }
    );

    const refId = generateRefId();

    const booking = await Booking.create({
      experienceId,
      slotIndex,
      name,
      email,
      promoCode,
      quantity,
      totalAmount,
      refId,
    });
    res.status(201).json({ ok: true, data: booking });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

app.listen(port, () => console.log("Server running"));