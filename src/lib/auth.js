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
          const userByEmail = await User.findOne({
            email: credentials.identifier,
          });
          if (userByEmail) {
            const isCorrectPassword = await compare(
              credentials.password,
              userByEmail.password
            );
            if (isCorrectPassword) {
              return userByEmail;
            } else {
              throw new Error("Incorrect password");
            }
          } else {
            const userByUsername = await User.findOne({
              username: credentials.identifier,
            });
            if (userByUsername) {
              const isCorrectPassword = await compare(
                credentials.password,
                userByUsername.password
              );
              if (isCorrectPassword) {
                return userByUsername;
              } else {
                throw new Error("Incorrect password");
              }
            } else {
              throw new Error("User not found");
            }
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
    async jwt({ token, user }) {
      if (user) token._id = user._id;
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const fetchUser = await User.findById(token._id);
        session.user = {
          _id: fetchUser._id,
          username: fetchUser.username,
          email: fetchUser.email,
          avatar: fetchUser.avatar,
          notes: fetchUser.notes,
        };
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
