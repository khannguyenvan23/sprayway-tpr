import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin đơn hàng",
};

export default function AdminOrdersPage() {
  redirect("/admin");
}
