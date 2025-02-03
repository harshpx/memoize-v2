import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const PUT = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user) {
      return Response.json(
        {
          sussess: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { avatar } = await req.json();
    if (!avatar) {
      return Response.json(
        {
          success: false,
          message: "Avatar is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      session.user._id,
      { avatar },
      { new: true }
    );

    if (updatedUser) {
      // const updatedSession = {
      //   ...session,
      //   user: {
      //     ...session.user,
      //     avatar: updatedUser.avatar,
      //   },
      // };
      return Response.json(
        {
          success: true,
          message: "Avatar updated successfully",
          // updatedSession,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update avatar",
      },
      {
        status: 500,
      }
    );
  }
};
