import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      // required: false,
      default: function () {
        return this.newPrice;
      }, 
    },
    newPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category", // Replace with the name of your category model
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand", // Replace with the name of your brand model
      required: true,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtuals when the document is converted to JSON
    toObject: { virtuals: true }, // Enable virtuals when the document is converted to a plain object
  }
);

// Pre 'findOneAndUpdate' hook to update OldPrice with the previous NewPrice
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Check if NewPrice is being updated
  if (update.$set && update.$set.newPrice) {
    // Find the current document to get the previous NewPrice
    const product = await this.model.findOne(this.getQuery());

    if (product) {
      // Set OldPrice to the current NewPrice before it gets updated
      update.$set.oldPrice = product.newPrice;
    }
  }

  next();
});

// Add virtual field to check if the product is discounted
productSchema.virtual("isDiscounted").get(function () {
  return this.oldPrice > this.newPrice;
});

export default mongoose.model("product", productSchema);
