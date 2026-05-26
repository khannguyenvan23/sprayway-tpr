import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin | QE Agency Trading",
};

export default function AdminOrdersPage() {
  redirect("/admin");
}
