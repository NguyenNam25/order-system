export function generateOrderCode(orderId: number): string {
  const date = new Date();

  const dateString =
    date.getFullYear().toString().slice(-2) +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");

  const code = orderId.toString(36).toUpperCase().padStart(6, "0");

  return `ORD-${dateString}-A${code}`;
}