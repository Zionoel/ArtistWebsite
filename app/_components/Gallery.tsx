"use client";

import { useState } from "react";

export type Work = {
  id: number;
  title: string;
  description: string;
  src: string;
};

export default function Gallery({ works, noWorksMessage }: { works: Work[]; noWorksMessage: string }) {
  const [selectedId, setSelectedId] = useState(works[0]?.id);
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());
  const selected = works.find((w) => w.id === selectedId) ?? works[0];
  const currentLoaded = loadedIds.has(selectedId);
  const selectedIdx = works.findIndex((w) => w.id === selectedId);

  const goPrev = () => setSelectedId(works[(selectedIdx - 1 + works.length) % works.length].id);
  const goNext = () => setSelectedId(works[(selectedIdx + 1) % works.length].id);

  if (!works.length) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] text-gray-500 text-sm">
        {noWorksMessage}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden group/gallery">

      {/* Grey pulse shown while current image is still loading */}
      {!currentLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}

      {/* All images stacked */}
      {works.map((work) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={work.id}
          src={work.src}
          alt={work.title}
          onLoad={() => setLoadedIds((prev) => new Set(prev).add(work.id))}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
            work.id === selectedId && loadedIds.has(work.id) ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Title + description — always visible on mobile, hover-only on desktop */}
      <div className="absolute bottom-16 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-sm
                      md:opacity-0 md:group-hover/gallery:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm tracking-widest uppercase mb-1">{selected?.title}</p>
        {selected?.description && (
          <p className="text-white/70 text-xs leading-relaxed whitespace-pre-line">{selected.description}</p>
        )}
      </div>

      {/* Mobile prev/next arrows */}
      {works.length > 1 && (
        <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-between items-center px-4">
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="text-white/60 hover:text-white text-xl px-3 py-2"
          >
            ←
          </button>
          <span className="text-white/30 text-xs">
            {selectedIdx + 1} / {works.length}
          </span>
          <button
            onClick={goNext}
            aria-label="Next"
            className="text-white/60 hover:text-white text-xl px-3 py-2"
          >
            →
          </button>
        </div>
      )}

      {/* Desktop sidebar — hover-only, hidden on mobile */}
      <div className="hidden md:flex absolute right-0 top-0 h-full flex-col justify-center pr-8 pl-16
                      opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300
                      bg-gradient-to-l from-black/50 to-transparent">
        <ul className="space-y-4">
          {works.map((work) => (
            <li key={work.id} className="text-right">
              <button
                onClick={() => setSelectedId(work.id)}
                className={`text-sm transition-colors ${
                  work.id === selectedId
                    ? "text-white font-semibold"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {work.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
