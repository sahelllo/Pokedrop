"use client";

import * as React from "react";
import { BellRing } from "lucide-react";
import { useToast } from "@/components/toast";
import { usePokeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { liveDrops } from "@/data/drops";
import { productsById } from "@/data/products";
import { productImageUrl } from "@/lib/images";

/**
 * Alert-Simulation (Abschnitt 6g / 7): löst eine Beispiel-Push-Benachrichtigung
 * aus, wie sie Premium-Nutzer bei einem Drop erhalten.
 */
export function AlertDemoButton() {
  const { push } = useToast();
  const premium = usePokeStore((s) => s.premium);
  const [i, setI] = React.useState(0);

  function trigger() {
    const drop = liveDrops[i % liveDrops.length];
    const product = productsById.get(drop.product_id);
    setI((v) => v + 1);
    push({
      title: `⚡ Instant Alert: ${drop.kind === "restock" ? "Restock" : "Drop"}`,
      description: `${product?.product_name ?? "Produkt"} · ${drop.source_name}${
        premium ? "" : " · Premium liefert das sofort"
      }`,
      kind: premium ? "alert" : "premium",
      imageUrl: product ? productImageUrl(product) : undefined,
    });
  }

  return (
    <Button onClick={trigger} variant={premium ? "secondary" : "outline"} className="shrink-0">
      <BellRing className="h-4 w-4" />
      Alert testen
    </Button>
  );
}
