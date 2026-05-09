const Payment = require('../models/Payments');
const Invoice = require('../models/Invoices');

// CREATE PAYMENT
exports.createPayment = async (req, res) => {
    try {
        const { invoice_id, amount, method } = req.body;

        // 1. vérifier facture
        const invoice = await Invoice.findById(invoice_id);
        if (!invoice) {
            return res.status(404).json({ message: "Facture introuvable" });
        }

        // 2. créer paiement
        const payment = await Payment.create({
            invoice_id,
            amount,
            method,
            status: 'Validé'
        });

        // 3. calcul total payé
        const payments = await Payment.find({ 
            invoice_id, 
            status: 'Validé' 
        });

        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

        // 4. update status facture
        if (totalPaid >= invoice.total_amount) {
            invoice.payment_status = 'Payée';
        } else if (totalPaid > 0) {
            invoice.payment_status = 'Payée partiellement';
        }

        await invoice.save();

        res.status(201).json({
            message: "Paiement enregistré",
            payment,
            totalPaid,
            remaining: invoice.total_amount - totalPaid
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET PAYMENTS PAR FACTURE
exports.getPaymentsByInvoice = async (req, res) => {
    try {
        const payments = await Payment.find({ invoice_id: req.params.invoice_id })
            .populate('method');

        res.json(payments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};