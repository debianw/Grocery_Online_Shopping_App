import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    email: String,
    password: String,
    salt: String,
    phone: String,
    address: [
        {
            street: String,
            postalCode: String,
            city: String,
            country: String
        }
    ],
    cart: [
        {
            product: {
                _id: Schema.Types.ObjectId,
                name: String,
                banner: String,
                price: Number,
            },
            unit: { type: Number, require: true }
        }
    ],
    wishlist: [
        {
            _id: Schema.Types.ObjectId,
            name: String,
            description: String,
            banner: String,
            price: Number,
        }
    ],
    orders: [
        {
            _id: Schema.Types.ObjectId,
            amount: Number,
            date: { type: Date, default: Date.now },
        }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

export default mongoose.model('customer', CustomerSchema);