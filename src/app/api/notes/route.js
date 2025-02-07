import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const POST = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { title, content, color, pinned } = await req.json();

  if (!title.trim() && !content.trim()) {
    return Response.json(
      {
        success: false,
        message: "Empty Note",
      },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findById(session.user._id);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const newNote = {
      id:
        Math.random().toString(36).substring(2) +
        "-" +
        Math.random().toString(36).substring(2) +
        "-" +
        Math.random().toString(36).substring(2),
      status: "active", // active, archived
      title: title.trim(),
      content: content.trim(),
      color: color || "#171717",
      pinned: pinned ?? false,
      updatedAt: new Date(),
    };
    user.notes.push(newNote);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Note created",
        note: newNote,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const { id, title, content, color, pinned } = await req.json();

  if (!id || (!title.trim() && !content.trim())) {
    return Response.json(
      {
        success: false,
        message: "Insudfficient data",
      },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findById(session.user._id);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    user.notes = user.notes.map((note) =>
      note.id === id
        ? {
            ...note,
            title: title.trim(),
            content: content.trim(),
            color,
            pinned,
          }
        : note
    );
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Note updated",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { id } = await req.json();
  if(!id) {
    return Response.json(
      {
        success: false,
        message: "No Id provided",
      },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findById(session.user._id);
    if(!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    user.notes = user.notes.filter((note) => note.id !== id);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Note deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
