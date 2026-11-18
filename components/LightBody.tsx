"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// La pagina Utente ha lo sfondo panna (classe "light" sul body, impostata prima di disegnare per evitare lampi scuri).
const LIGHT = ["/profilo"];

export default function LightBody() {
  const path = usePathname();
  useLayoutEffect(() => {
    document.body.classList.toggle("light", LIGHT.includes(path));
    return () => document.body.classList.remove("light");
  }, [path]);
  return null;
}
