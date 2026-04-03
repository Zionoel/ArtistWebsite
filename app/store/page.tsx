const items = [
  {
    name: "Illustration Book Vol.1",
    type: "Art Book",
    src: "https://placehold.co/400x400",
    url: "https://etsy.com/shop/placeholder",
  },
  {
    name: "Character Print — A4",
    type: "Print",
    src: "https://placehold.co/400x400",
    url: "https://etsy.com/shop/placeholder",
  },
  {
    name: "Mouse Pad — Landscape",
    type: "Merchandise",
    src: "https://placehold.co/400x400",
    url: "https://redbubble.com/people/placeholder",
  },
  {
    name: "Sticker Sheet Vol.1",
    type: "Stickers",
    src: "https://placehold.co/400x400",
    url: "https://etsy.com/shop/placeholder",
  },
  {
    name: "Acrylic Stand",
    type: "Merchandise",
    src: "https://placehold.co/400x400",
    url: "https://placeholder.booth.pm",
  },
  {
    name: "Tote Bag",
    type: "Apparel",
    src: "https://placehold.co/400x400",
    url: "https://redbubble.com/people/placeholder",
  },
];

const stores = [
  {
    name: "Etsy",
    description: "Prints, stickers, and original works",
    url: "https://etsy.com/shop/placeholder",
  },
  {
    name: "Redbubble",
    description: "Apparel, accessories, and home goods",
    url: "https://redbubble.com/people/placeholder",
  },
  {
    name: "Booth",
    description: "Doujinshi and limited edition items",
    url: "https://placeholder.booth.pm",
  },
];

export default function Store() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-16 space-y-16">
      <h1 className="text-2xl font-semibold">Store</h1>

      {/* Product grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          Items
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.name}
                className="w-full aspect-square object-cover transition-opacity group-hover:opacity-75"
              />
              <div className="mt-2">
                <p className="text-sm group-hover:underline">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.type}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Store links */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          Where to find my work
        </h2>
        <div className="divide-y divide-gray-100">
          {stores.map((store) => (
            <a
              key={store.name}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center py-4 group"
            >
              <div>
                <p className="text-sm font-medium group-hover:underline">{store.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{store.description}</p>
              </div>
              <span className="text-gray-300 group-hover:text-black transition-colors text-lg">→</span>
            </a>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>All items are designed and created by me.</p>
        <p>For commercial licensing or bulk orders, please use the contact form.</p>
      </div>
    </div>
  );
}
