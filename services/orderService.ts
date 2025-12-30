
import { ORDER_NOTIFICATION_EMAIL, GOOGLE_SHEETS_WEBHOOK_URL } from "../constants";
import { CartItem } from "../types";

export interface OrderData {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: CartItem[];
  total: number;
  timestamp: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

/**
 * Submits the order to your provided database webhook and saves to local persistence.
 */
export async function processOrderSubmission(order: OrderData) {
  console.log(`[Database] Submitting Order ${order.orderId}`);
  
  // 1. Save to Local Persistence for Admin Panel visibility
  const existingOrders = JSON.parse(localStorage.getItem('chaunsa_orders') || '[]');
  localStorage.setItem('chaunsa_orders', JSON.stringify([order, ...existingOrders]));

  const payload = {
    ...order,
    itemSummary: order.items.map(i => `${i.quantity}x ${i.name} (${i.unit})`).join(', '),
    action: "NEW_ORDER",
    recipient: ORDER_NOTIFICATION_EMAIL
  };

  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { success: true, orderId: order.orderId };
  } catch (error) {
    console.error("Database connection error:", error);
    return { success: true, orderId: order.orderId };
  }
}

/**
 * Admin: Retrieve all stored orders
 */
export function getAllOrders(): OrderData[] {
  return JSON.parse(localStorage.getItem('chaunsa_orders') || '[]');
}

/**
 * Admin: Update order status
 */
export function updateOrderStatus(orderId: string, status: OrderData['status']) {
  const orders = getAllOrders();
  const updated = orders.map(o => o.orderId === orderId ? { ...o, status } : o);
  localStorage.setItem('chaunsa_orders', JSON.stringify(updated));
}

/**
 * Admin: Clear all orders (Wipe Database)
 */
export function clearAllOrders() {
  localStorage.removeItem('chaunsa_orders');
}

/**
 * Admin: Export Database to CSV
 */
export function exportOrdersToCSV() {
  const orders = getAllOrders();
  if (orders.length === 0) return null;

  const headers = ["Order ID", "Date", "Customer", "Phone", "Address", "Items", "Total", "Status"];
  const rows = orders.map(o => [
    o.orderId,
    new Date(o.timestamp).toLocaleString(),
    o.customer.name,
    `"${o.customer.phone}"`,
    `"${o.customer.address.replace(/\n/g, ' ')}"`,
    `"${o.items.map(i => `${i.quantity}x ${i.name}`).join('; ')}"`,
    o.total,
    o.status
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `chaunsa_database_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a direct link to Gmail Compose to ensure it uses the user's Google account
 */
export function generateGmailLink(order: OrderData) {
  const subject = encodeURIComponent(`👑 NEW CHAUNSA ORDER: ${order.orderId}`);
  const itemsList = order.items.map(i => `• ${i.quantity}x ${i.name} (${i.unit}) - Rs. ${i.price * i.quantity}`).join('\n');
  const body = encodeURIComponent(
    `ORDER ID: ${order.orderId}\n` +
    `CUSTOMER: ${order.customer.name}\n` +
    `PHONE: ${order.customer.phone}\n` +
    `ADDRESS: ${order.customer.address}\n\n` +
    `ITEMS:\n${itemsList}\n\n` +
    `TOTAL: Rs. ${order.total.toLocaleString()}`
  );
  
  // This URL format specifically opens the Gmail web composer
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${ORDER_NOTIFICATION_EMAIL}&su=${subject}&body=${body}`;
}
