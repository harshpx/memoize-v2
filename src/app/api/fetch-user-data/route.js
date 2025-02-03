import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if(!session || !session?.user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    await connectToDatabase();
    const user = await User.findById(session.user._id);
    if(user) {
      return Response.json(
        {
          success: true,
          message: "User data fetched successfully",
          user: {
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            password: user.password,
            notes: user.notes,
          },
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Unable to fetch user data",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
};
