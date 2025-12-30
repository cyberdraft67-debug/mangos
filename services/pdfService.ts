
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderData } from "./orderService";

/**
 * Generates and downloads a professional PDF invoice for a single Chaunsa Gold order.
 */
export async function generateOrderPDF(order: OrderData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Branding
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CHAUNSA GOLD", 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("PREMIUM MANGO EMPORIUM", 20, 28);
  
  doc.setFontSize(12);
  doc.text(`INVOICE: ${order.orderId}`, pageWidth - 20, 25, { align: "right" });

  // Order Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 20, 55);
  
  doc.setFont("helvetica", "normal");
  doc.text(order.customer.name, 20, 62);
  doc.text(order.customer.phone, 20, 68);
  
  const addressLines = doc.splitTextToSize(order.customer.address, 80);
  doc.text(addressLines, 20, 74);

  doc.setFont("helvetica", "bold");
  doc.text("DATE:", pageWidth - 70, 55);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(order.timestamp).toLocaleDateString(), pageWidth - 70, 62);

  // Items Table
  const tableData = order.items.map(item => [
    item.name,
    `${item.quantity} x ${item.unit}`,
    `Rs. ${item.price.toLocaleString()}`,
    `Rs. ${(item.price * item.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 95,
    head: [['Product', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255] },
    styles: { font: "helvetica", fontSize: 9 },
    columnStyles: {
      3: { halign: 'right' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 150;

  // Grand Total
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`GRAND TOTAL: Rs. ${order.total.toLocaleString()}`, pageWidth - 20, finalY + 20, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing Chaunsa Gold. The King of Mangoes awaits your palate.", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

  // Save PDF
  doc.save(`Chaunsa_Gold_Invoice_${order.orderId}.pdf`);
}

/**
 * Generates and downloads a summary report of multiple orders as a PDF.
 */
export async function generateOrdersSummaryPDF(orders: OrderData[], filterName: string = "All") {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Branding Header
  doc.setFillColor(31, 41, 55); // Dark Gray
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CHAUNSA GOLD HQ", 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`ORDER DATABASE EXPORT - STATUS: ${filterName.toUpperCase()}`, 20, 28);
  doc.text(`GENERATED: ${new Date().toLocaleString()}`, pageWidth - 20, 28, { align: "right" });

  const tableData = orders.map(o => [
    o.orderId,
    new Date(o.timestamp).toLocaleDateString(),
    o.customer.name,
    o.customer.phone,
    o.status.toUpperCase(),
    `Rs. ${o.total.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['ID', 'Date', 'Customer', 'Phone', 'Status', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
    styles: { font: "helvetica", fontSize: 8 },
    columnStyles: {
      5: { halign: 'right', fontStyle: 'bold' }
    }
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const finalY = (doc as any).lastAutoTable.finalY || 60;

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Records: ${orders.length}`, 20, finalY + 15);
  doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`, pageWidth - 20, finalY + 15, { align: "right" });

  doc.save(`Chaunsa_Gold_Database_${filterName}_${Date.now()}.pdf`);
}
