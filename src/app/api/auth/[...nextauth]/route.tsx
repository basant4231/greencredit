import NextAuth, { NextAuthOptions, } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import Activity from "@/models/Activity";

export const authOptions:NextAuthOptions = {
  providers: [
    // 1. Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {}, // We handle the input in our custom logic
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          await dbConnect();
          const user = await User.findOne({ email }).select("+password");

          if (!user) throw new Error("No user found with this email");

          const passwordMatch = await bcrypt.compare(password as string, user.password as string);
          if (!passwordMatch) throw new Error("Incorrect password");

          return user; // NextAuth now creates a session for this user
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    // 3. The Session Callback
    // This ensures the user's ID from MongoDB is available in the frontend 'session' object
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub; // This links the session to the DB user ID
      }
      return session;
    },
    
    // 4. The Sign-In Callback (Optional but professional)
    // You can use this to block certain users or log activity
async signIn({ user, account }: any) {
  if (account.provider === "google") {
    try {
      await dbConnect(); // One-time connection
      
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create user first
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: 'user',
        });

        // Optimization: Don't 'await' the Activity creation
        // Let it run in the background while the user is redirected
        Activity.create({
          userId: newUser._id,
          title: "Initial Eco-Bonus",
          category: "Energy",
          creditsEarned: 50,
          status: "approved"
        }).catch(err => console.error("Background Activity Error:", err)); 

      } else {
        // Use updateOne instead of .save() to reduce round-trips
        User.updateOne(
          { _id: existingUser._id },
          { $set: { name: user.name, image: user.image } }
        ).catch(err => console.error("Background Update Error:", err));
      }
      return true; 
    } catch (error) {
      console.error("Sign-In Latency Error:", error);
      return false;
    }
  }
  return true;
}
// Inside your authOptions object

  },


  session: {
    strategy: "jwt", // Use JSON Web Tokens for fast session checks
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Points to your custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };