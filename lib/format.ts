export function formatVND(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(price);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN").format(date);
}

export function formatUSD(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
