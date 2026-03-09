const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Medicine, Equipment
    stockQuantity: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true },
    supplier: { type: String },
    manufacturer: { type: String },
    assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    description: { type: String },
    expiryDate: { type: Date },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);
