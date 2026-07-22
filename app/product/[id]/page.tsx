import { products } from "@/data/products";
import { ProductDetailClient } from "./product-detail";

/**
 * Server-Komponente: erzeugt beim statischen Export (GitHub Pages) für jedes
 * Produkt eine eigene Seite vor. Der interaktive Teil steckt im Client-Kind.
 */
export function generateStaticParams() {
  return products.map((p) => ({ id: p.product_id }));
}

export const dynamicParams = false;

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient id={params.id} />;
}
