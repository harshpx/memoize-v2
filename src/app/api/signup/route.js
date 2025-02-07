import User from "@/models/User";
import connectToDatabase from "@/lib/db";
import { hash } from "bcryptjs";

export const POST = async (request) => {
  try {
    await connectToDatabase();
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Please provide all fields",
        },
        { status: 400 }
      );
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "This username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "This email is already taken",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      notes: [],
      todos: [],
    });
    await newUser.save();

    return Response.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error creating user",
      },
      { status: 500 }
    );
  }
};
