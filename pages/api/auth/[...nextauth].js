import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../database/conn";
import Users from "../../../model/schema";
import { compare } from "bcryptjs";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // google provider;
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        connectMongo().catch((error) =>
          res.json({ error: "Connection Failed...!" })
        );
        const result = await Users.findOne({ email: credentials.email });
        if (!result) {
          throw new Error("No user found! Please sign up first...!");
        }
        const checkPassword = await compare(
          credentials.password,
          result.password
        );

        // incorrect password
        if (!checkPassword || result.email !== credentials.email) {
          throw new Error("Username or Password doesn't match");
        }

        return result;
      },
    }),
  ],
  secret: "htj8U+XZ+B4i2z5xsZwZX5kBe+IRjHkRkVPzPvdze8U=",
});
