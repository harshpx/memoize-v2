import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { compare, hash } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found, please signup");
          }
          const isCorrectPassword = await compare(
            credentials.password,
            user.password
          );
          if (isCorrectPassword) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) token._id = user._id;
      return token;
    },
    async session({session, token}) {
      if(token){
        const fetchUser = await User.findById(token._id);
        session.user = {
          _id: fetchUser._id,
          username: fetchUser.username,
          email: fetchUser.email,
          avatar: fetchUser.avatar,
          notes: fetchUser.notes,
        }
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/",
  },
};
