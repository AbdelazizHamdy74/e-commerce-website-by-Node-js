const mongoose = require("mongoose");
// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [2, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
//create
brandSchema.post("save", function (doc) {
  setImageURL(doc);
});
//getAll, gitSpecific , and update
brandSchema.post("init", function (doc) {
  setImageURL(doc);
});
// 2- Create model
module.exports = mongoose.model("Brand", brandSchema);
