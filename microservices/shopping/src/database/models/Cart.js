import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  desc: String,
  banner: String,
  type: String,
  unit: Number,
  price: Number,
})

const CartSchema = new Schema({
  customerId: String,
  items: [
    {
      product: ProductSchema,
      unit: { type: Number, require: true }
    }
  ]
},
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      }
    },
    timestamps: true
  });

export default mongoose.model('cart', CartSchema);