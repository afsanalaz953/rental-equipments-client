import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DB_URI as string);
const db = client.db("full-project-client");

export const auth = betterAuth({
 database: mongodbAdapter(db, {
    client,
  }),
  user: {
       additionalFields: {
          role: {
              type: "string",
                required: false, 
              defaultValue: "customer",
              // input: true
            } 
        }
    },

  //...other options
  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: { 
    // github: { 
    //   clientId: process.env.GITHUB_CLIENT_ID as string, 
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    // }, 
  }, 
});