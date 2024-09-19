import { Schema, model } from "mongoose";
import Newsletter from "./newsletterModel";

const subscriberSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  newsletters: [{ type: Schema.Types.ObjectId, ref: "Newsletter" }], // Можна зберігати посилання на всі листи розсилки
});

subscriberSchema.pre("deleteOne", async function (next) {
  try {
    const subscriberId = this.getFilter()["_id"];
    await Newsletter.deleteMany({ subscriber: subscriberId });
    next();
  } catch (error: any) {
    next(error);
  }
});

const Subscriber = model("Subscriber", subscriberSchema);

export default Subscriber;
