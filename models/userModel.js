const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //  Trim removes whitespace characters from the beginning and end of a string
      required: [true, "name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    profileImage: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: [true, "Phone number must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    passwordChangeAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

//Hashing password of a user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 7);
  next();
});

const setImageURL = (doc) => {
  if (doc.profileImage) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
};
//create
userSchema.post("save", function (doc) {
  setImageURL(doc);
});
//getAll, gitSpecific , and update
userSchema.post("init", function (doc) {
  setImageURL(doc);
});

module.exports = mongoose.model("User", userSchema);
