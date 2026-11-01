import type { Metadata } from "next";
import { OrderView } from "@/components/order-view";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="page py-8">
      <OrderView id={Number((await params).id)} />
    </div>
  );
}
