import mongoose, { Schema } from "mongoose";
import avatar from "animal-avatar-generator";

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

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
    notes: [NoteSchema],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;