const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order) => {
  const invoicesDir = path.join(__dirname, "../invoices");

  // Ensure folder exists
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const fileName = `invoice_${order._id}.pdf`;
  const filePath = path.join(invoicesDir, fileName);

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text("Mellow Café Invoice", { align: "center" });
  doc.moveDown();

  // Order details
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Payment ID: ${order.paymentId}`);
  doc.text(`Customer: ${order.userEmail}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown();

  // Items
  doc.text("Items:");
  doc.moveDown(0.5);

  order.items.forEach((item) => {
    doc.text(`${item.name} - ₹${item.price} x ${item.quantity}`);
  });

  doc.moveDown();

  // Total
  doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, {
    align: "right",
  });

  doc.end();

  return fileName;
};

module.exports = generateInvoice;