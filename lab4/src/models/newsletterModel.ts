import { Schema, model, Types } from "mongoose";

const newsletterSchema = new Schema({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  sendDate: { type: Date, required: true },
  subscriber: { type: Types.ObjectId, ref: 'Subscriber', required: true } // Додано посилання на підписника
});

const Newsletter = model("Newsletter", newsletterSchema);

export default Newsletter;

