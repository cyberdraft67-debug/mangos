
import { ORDER_NOTIFICATION_EMAIL, SPREADSHEET_WEBHOOK_URL } from "../constants";
import { CartItem } from "../types";

export interface OrderData {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
    carbide?: string;
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
  console.log(`[Database] Submitting Order ${order.orderId} to Excel/Spreadsheet`);
  
  // 1. Save to Local Persistence for Admin Panel visibility
  const existingOrders = JSON.parse(localStorage.getItem('chaunsa_orders') || '[]');
  localStorage.setItem('chaunsa_orders', JSON.stringify([order, ...existingOrders]));

  const payload = {
    orderId: order.orderId,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    customerAddress: order.customer.address,
    customerNotes: order.customer.notes || '',
    carbide: order.customer.carbide || 'Yes',
    itemSummary: order.items.map(i => `${i.quantity}x ${i.name} (${i.unit})`).join(', '),
    quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: order.total,
    timestamp: order.timestamp,
    date: new Date(order.timestamp).toLocaleString(),
    status: order.status,
    action: "NEW_ORDER",
    recipient: ORDER_NOTIFICATION_EMAIL,
    source: "Heritage Reserve Web Store",
    customer: {
      name: order.customer.name,
      phone: order.customer.phone,
      address: order.customer.address,
      notes: order.customer.notes || '',
      carbide: order.customer.carbide || 'Yes'
    }
  };

  try {
    const response = await fetch(SPREADSHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    return { success: true, orderId: order.orderId };
  } catch (error) {
    console.error("Spreadsheet connection error:", error);
    // Even if webhook fails, we return success: true because the order is saved locally 
    // and the user shouldn't be blocked, but we've logged the error for debugging.
    return { success: true, orderId: order.orderId, error: "Cloud sync pending" };
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

