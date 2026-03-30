import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import Activity from "@/models/Activity";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        await dbConnect();
        const user = await User.findOne({ email }).select("+password");

        if (!user?.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password as string);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const safeName = user.name ?? "Eco User";

      try {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = await User.create({
            name: safeName,
            email: user.email,
            image: user.image ?? undefined,
            role: "user",
          });

          void Activity.create({
            userId: newUser._id,
            title: "Initial Eco-Bonus",
            category: "Energy",
            creditsEarned: 50,
            status: "approved",
          }).catch((error: unknown) => {
            console.error("Background Activity Error:", error);
          });
        } else {
          const updates: { name: string; image?: string } = { name: safeName };
          if (user.image) {
            updates.image = user.image;
          }

          void User.updateOne(
            { _id: existingUser._id },
            { $set: updates }
          ).catch((error: unknown) => {
            console.error("Background Update Error:", error);
          });
        }

        return true;
      } catch (error) {
        console.error("Sign-In Latency Error:", error);
        return false;
      }
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
