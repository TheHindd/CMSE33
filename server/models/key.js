import mongoose from 'mongoose';

const keySchema = mongoose.Schema({
    key: { type: String, required: true },
    id: { type: String }
});

export default mongoose.model('Key', keySchema);
