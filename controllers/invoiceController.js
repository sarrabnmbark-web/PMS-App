const Invoice = require('../models/Invoices');
const PDFDocument = require('pdfkit');

const exportInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID reçu :", id);

    // 🔥 Vérifie si l'ID est valide MongoDB
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const invoice = await Invoice.findById(id)
      .populate({
        path: 'stay_id',
        populate: {
          path: 'reservation_id',
          populate: [
            {
              path: 'client_id',
              select: 'full_name email'
            },
            {
              path: 'room_id',
              select: 'room_number'
            }
          ]
        }
      });

    console.log("Invoice trouvée :", invoice);

    if (!invoice) {
      return res.status(404).json({ message: "Facture introuvable" });
    }

    // Headers PDF CORRIGÉS
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=facture-${invoice.invoice_number}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    // PDF CONTENT (corrigé backticks partout)
    doc.fontSize(25).text('FACTURE HOTEL', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Numéro de facture : ${invoice.invoice_number}`);
    doc.text(`Date : ${new Date(invoice.generated_at).toLocaleDateString()}`);
    doc.text(`Statut : ${invoice.payment_status}`);
    doc.moveDown();

    // ⚠️ sécurisation (évite crash si populate échoue)
    const client = invoice?.stay_id?.reservation_id?.client_id;
    const room = invoice?.stay_id?.reservation_id?.room_id;

    doc.text(`Client : ${client?.full_name || 'N/A'}`);
    doc.text(`Email : ${client?.email || 'N/A'}`);
    doc.text(`Chambre : ${room?.room_number || 'N/A'}`);

    doc.moveDown();

    doc.fontSize(20).text(
      `Total à payer : ${invoice.total_amount} €`,
      { align: 'right' }
    );

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { exportInvoicePDF };