import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "teacher"],
    default: "student",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Must add this upper line it Skips rehashing if the password field hasn't been modified (used when we update any field)
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = new mongoose.model("User", userSchema);
export default User;
