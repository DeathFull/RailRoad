import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["Admin", "User"] },
});

UserSchema.plugin(passportLocalMongoose);

export const UserModel = mongoose.model("User", UserSchema);
