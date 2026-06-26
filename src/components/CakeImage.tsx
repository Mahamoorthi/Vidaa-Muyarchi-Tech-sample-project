"use client";

import Image from "next/image";
import { useState } from "react";

export default function CakeImage({
  seed,
  className = "",
}: {
  seed?: string | number;
  variant?: string;
  className?: string;
}) {
  const [img, setImg] = useState(
    typeof seed === "string"
      ? `/cakes/${seed}.jpg`
      : "/cakes/chocolate-truffle.jpg"
  );

  return (
    <Image
      src={img}
      alt="Cake"
      width={500}
      height={500}
      className={className}
      unoptimized
      onError={() => setImg("/cakes/chocolate-truffle.jpg")}
    />
  );
}