import mongoose, { Schema } from "mongoose";
import avatar from "animal-avatar-generator";
import { object } from "zod";

// note's schema:
// id: String
// title: String
// content: String
// pinned: Boolean
// color: String
// updatedAt: Date

// todo's schema:
// id: String
// title: String
// completed: Boolean
// updatedAt: Date

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    avatar: {
      type: String,
      default: `data:image/svg+xml;base64,${btoa(
        avatar("harsh", { size: 400 })
      )}`,
    },
    notes: {
      type: [Object],
      default: [],
    },
    todos: {
      type: [Object],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;