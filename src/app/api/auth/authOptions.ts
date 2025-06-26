import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        if (!user.isVerified) throw new Error("User not verified");

        return {
          id: user._id.toString(),
          email: user.email,
          userName: user.userName,
          isVerified: user.isVerified,
          firstTimeLogin: user.firstTimeLogin ?? false,
          profileImage: user.profileImage ?? "",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 2 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account }: any) {
      await dbConnect();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new User({
            userName: user.name.replace(/\s+/g, "").toLowerCase(),
            email: user.email,
            password: null,
            isVerified: true,
            createdAt: Date.now(),
            firstTimeLogin: true,
            provider: "google",
            profileImage: "",
          });
          await newUser.save();
        }
      }
      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.user = {
          id: user.id || user._id?.toString(),
          email: user.email,
          isVerified: user.isVerified ?? true,
          firstTimeLogin: user.firstTimeLogin ?? false,
          profileImage: user.profileImage ?? "",
        };
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user.email = token.user.email;
      session.user.id = token.user.id;
      session.user.profileImage = token.user.profileImage ?? "";
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/userLogin",
  },
};
