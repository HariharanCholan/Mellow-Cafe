const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order) => {
  const invoicesDir = path.join(__dirname, "../invoices");

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const fileName = `invoice_${order._id}.pdf`;
  const filePath = path.join(invoicesDir, fileName);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Mellow Café Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Payment ID: ${order.paymentId}`);
  doc.text(`Customer: ${order.userEmail}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown();

  doc.text("Items:");
  order.items.forEach(item => {
    doc.text(`${item.name} - ₹${item.price} x ${item.quantity}`);
  });

  doc.moveDown();
  doc.text(`Total: ₹${order.totalAmount}`);

  doc.end();

  return fileName;
};

module.exports = generateInvoice;