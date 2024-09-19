import { Router } from "express";
import Subscriber from "../models/subscriberModel";

const router = Router();

// Додати нового підписника
router.post("/subscribers", async (req, res) => {
  const { name, email, address, password } = req.body;
  try {
    const subscriber = new Subscriber({ name, email, address, password });
    await subscriber.save();
    res.status(201).json(subscriber);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Отримати всіх підписників
router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Отримати всіх підписників
router.get("/subscribers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const subscriber = await Subscriber.findById(id);
    res.json(subscriber);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Оновити підписника
router.put("/subscribers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, address, password } = req.body;
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(
      id,
      { name, email, address, password },
      { new: true }
    );
    res.json(subscriber);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Видалити підписника
router.delete("/subscribers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Subscriber.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
