const InvoiceItem = require('../models/InvoiceItems');
const Invoice = require('../models/Invoices');

// ADD ITEM
exports.addItem = async (req, res) => {
    try {
        const { invoice_id, description, quantity, unit_price } = req.body;

        const total = quantity * unit_price;

        const item = await InvoiceItem.create({
            invoice_id,
            description,
            quantity,
            unit_price,
            total
        });

        // UPDATE TOTAL FACTURE
        const items = await InvoiceItem.find({ invoice_id });
        const itemsTotal = items.reduce((sum, i) => sum + i.total, 0);

        const invoice = await Invoice.findById(invoice_id);
        invoice.total_amount += itemsTotal;
        //invoice.total_amount = itemsTotal; test

        await invoice.save();

        res.status(201).json({
            message: "Service ajouté à la facture",
            item,
            newTotal: invoice.total_amount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ITEMS
exports.getItemsByInvoice = async (req, res) => {
    try {
        const items = await InvoiceItem.find({ invoice_id: req.params.invoice_id });

        res.json(items);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};