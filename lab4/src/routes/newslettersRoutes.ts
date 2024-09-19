import { Router } from "express";
import Newsletter from "../models/newsletterModel";
import Subscriber from "../models/subscriberModel";

const router = Router();

// Додати нову розсилку
router.post("/newsletters", async (req, res) => {
  const { subject, content, sendDate, subscriberEmail } = req.body;

  try {
    // Знайдіть підписника по email
    const subscriber = await Subscriber.findOne({ email: subscriberEmail });

    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    // Створіть розсилку для цього підписника
    const newsletter = new Newsletter({
      subject,
      content,
      sendDate,
      subscriber: subscriber._id,
    });

    await newsletter.save();

    // Можливо, додати цю розсилку до списку розсилок підписника
    subscriber.newsletters.push(newsletter._id);
    await subscriber.save();

    res.status(201).json(newsletter);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Отримати всі розсилки
router.get("/newsletters", async (req, res) => {
  try {
    const newsletters = await Newsletter.find().populate({
      path: "subscriber",
      select: "email",
    });
    res.json(newsletters);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Отримати всіх підписників
router.get("/newsletters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const newsletter = await Newsletter.findById(id);
    res.json(newsletter);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Оновити розсилку
router.put("/newsletters/:id", async (req, res) => {
  const { id } = req.params;
  const { subject, content, sendDate } = req.body;
  try {
    const newsletter = await Newsletter.findByIdAndUpdate(
      id,
      { subject, content, sendDate },
      { new: true }
    );
    res.json(newsletter);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Видалити розсилку
router.delete("/newsletters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Newsletter.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
