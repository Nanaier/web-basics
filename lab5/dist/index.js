import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
const subscriberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
subscriberSchema.pre("deleteOne", async function (next) {
    try {
        const subscriberId = this.getFilter()["_id"];
        await Newsletter.deleteMany({ subscriber: subscriberId });
        next();
    }
    catch (error) {
        next(error);
    }
});
const Subscriber = mongoose.model("Subscriber", subscriberSchema);
const newsletterSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    content: { type: String, required: true },
    sendDate: { type: Date, required: true },
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscriber",
        required: true,
    },
});
const Newsletter = mongoose.model("Newsletter", newsletterSchema);
const typeDefs = `
type Subscriber {
  _id: ID!
  name: String!
  address: String!
  email: String!
  password: String!
}

type Newsletter {
  _id: ID!
  subject: String!
  content: String!
  sendDate: String!
  subscriber: Subscriber!
}

input SubscriberInput {
  name: String!
  address: String!
  email: String!
  password: String!
}

input NewsletterInput {
  subject: String!
  content: String!
  sendDate: String!
  subscriber: ID!
}

type Query {
  subscribers: [Subscriber]
  subscriber(id: ID!): Subscriber
  newsletters: [Newsletter]
  newsletter(id: ID!): Newsletter
}

type Mutation {
  createSubscriber(input: SubscriberInput!): Subscriber
  updateSubscriber(id: ID!, input: SubscriberInput!): Subscriber
  deleteSubscriber(id: ID!): Subscriber
  createNewsletter(input: NewsletterInput!): Newsletter
  updateNewsletter(id: ID!, input: NewsletterInput!): Newsletter
  deleteNewsletter(id: ID!): Newsletter
}
`;
const resolvers = {
    Query: {
        subscribers: async () => await Subscriber.find(),
        subscriber: async (_, { id }) => await Subscriber.findById(id),
        newsletters: async () => await Newsletter.find().populate("subscriber"),
        newsletter: async (_, { id }) => await Newsletter.findById(id).populate("subscriber"),
    },
    Mutation: {
        createSubscriber: async (_, { input }) => await Subscriber.create(input),
        updateSubscriber: async (_, { id, input }) => await Subscriber.findByIdAndUpdate(id, input, { new: true }),
        deleteSubscriber: async (_, { id }) => {
            const subscriber = await Subscriber.findById(id);
            if (!subscriber)
                throw new Error("Subscriber not found");
            await subscriber.deleteOne();
            return subscriber;
        },
        createNewsletter: async (_, { input }) => await Newsletter.create(input),
        updateNewsletter: async (_, { id, input }) => await Newsletter.findByIdAndUpdate(id, input, { new: true }),
        deleteNewsletter: async (_, { id }) => await Newsletter.findByIdAndDelete(id),
    },
};
// Connect to MongoDB
mongoose
    .connect("mongodb+srv://nanaier:02042004@maincluster.5nhdxbl.mongodb.net/newsletterSubscribers?retryWrites=true&w=majority")
    .then(async () => {
    console.log("Connected to MongoDB");
})
    .catch((err) => console.error("Error connecting to MongoDB:", err));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    const connectedDbName = mongoose.connection.db.databaseName;
    console.log("Connected to database:", connectedDbName);
});
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Server listening at: ${url}`);
