"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AboutCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % images.length;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="relative w-full h-[60vh] overflow-hidden bg-[#0a0a0a]">
      {/* Previous image — fades out */}
      {prev !== null && (
        <Image
          key={`prev-${prev}`}
          src={images[prev]}
          alt=""
          fill
          sizes="100vw"
          className="object-contain absolute inset-0 animate-fade-out pointer-events-none"
          priority={false}
          unoptimized
        />
      )}
      {/* Current image — fades in */}
      <Image
        key={`curr-${current}`}
        src={images[current]}
        alt=""
        fill
        sizes="100vw"
        className="object-contain absolute inset-0 animate-fade-in"
        priority={current === 0}
        unoptimized
      />
      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrev(current); setCurrent(i); }}
              aria-label={`Image ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === current ? "bg-white/70" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
