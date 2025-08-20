import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderId: String,
    customerId: String,
    amount: Number,
    status: String,
    txnId: String,
    items: [
        {
            product: {
                _id: Schema.Types.ObjectId,
                name: String,
                banner: String,
                price: Number,
            },
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

export default mongoose.model('order', OrderSchema);