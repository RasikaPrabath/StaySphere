export const FEATURED_COLLECTIONS = [
  {
    id: "beachfront",
    title: "Beachfront Escapes",
    count: "2,450 properties",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tag: "Coastal & Islands",
    description: "Sun-drenched villas and private island retreats with crystal clear waters."
  },
  {
    id: "luxury-villas",
    title: "Luxury Villas",
    count: "1,820 properties",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    tag: "Exclusive Estates",
    description: "Spacious private estates with infinity pools, personal chefs, and helicopter pads."
  },
  {
    id: "boutique-city",
    title: "Boutique City Stays",
    count: "3,100 properties",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    tag: "Urban Elegance",
    description: "Architectural gems situated in the heart of fashion and culture capitals."
  },
  {
    id: "mountain-retreats",
    title: "Alpine & Mountain Chalets",
    count: "940 properties",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    tag: "Winter & Wilderness",
    description: "Cozy fireside suites and ski-in/ski-out lodges nestled in panoramic snowcapped peaks."
  }
];

export const TRENDING_DESTINATIONS = [
  {
    id: "colombo",
    name: "Colombo, Sri Lanka",
    country: "Sri Lanka",
    stays: "500+ stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant coastal capital with luxury harbor hotels and rich heritage."
  },
  {
    id: "paris",
    name: "Paris, France",
    country: "France",
    stays: "1,240 stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "City of lights, romantic boulevards, and fine dining."
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    stays: "850 stays",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    description: "Overwater luxury suites and serene coral reefs."
  },
  {
    id: "tokyo",
    name: "Tokyo, Japan",
    country: "Japan",
    stays: "2,100 stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "Futuristic skyscrapers, serene gardens, and Michelin gastronomy."
  },
  {
    id: "nyc",
    name: "New York, USA",
    country: "USA",
    stays: "3,420 stays",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    description: "Iconic penthouses overlooking Central Park and Broadway."
  },
  {
    id: "amalfi",
    name: "Amalfi Coast, Italy",
    country: "Italy",
    stays: "980 stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    description: "Cliffside Mediterranean estates with breathtaking sea views."
  },
  {
    id: "dubai",
    name: "Dubai, UAE",
    country: "UAE",
    stays: "1,560 stays",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    description: "Opulent skyscrapers, luxury desert resorts, and private beaches."
  },
  {
    id: "santorini",
    name: "Santorini, Greece",
    country: "Greece",
    stays: "1,120 stays",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    description: "Whitewashed villas over caldera sunsets."
  }
];

export const PROPERTIES = [
  {
    id: "prop-colombo-1",
    title: "The Cinnamon Grand Colombo",
    location: "Kollupitiya, Colombo",
    distance: "2.5 km from center",
    destinationId: "colombo",
    category: "boutique-city",
    price: 189,
    originalPrice: 245,
    taxes: 45,
    rating: 9.2,
    ratingText: "Excellent",
    reviewsCount: 1245,
    badge: "Top Pick",
    freeCancellation: true,
    cancellationNote: "You can cancel later, so lock in this great price today.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDm7z31oHqekvIrV54MN0uShXcTHMw-qnOf-oyOKCvWSzCD0W4K3-tCs6Ol4JQATp93oKp4PmD2-3I-LG7OgdHPa7h6vHQJxVFUbcQf44NQHTOokhsPq6Y2iMtJFGzHCX_ikD-b0MNeju6bpBfFgBGNgpFPT4KG07JYL2ZG27g2oSC06jw1OwpukbIdHMD-avqIkqNBZZKyDVDXlqljlfi_Fg1hfKLy1OkNyAMjE8f-ZylxJo7ZWQ7P",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Pool", "Free WiFi", "Spa", "Fitness Center", "Fine Dining", "Valet Parking"],
    specs: "2 Adults • 1 King Suite • 52 m²",
    description: "A premier 5-star oasis in the heart of Colombo. Features award-winning restaurants, dual outdoor pools, and tranquil wellness spas."
  },
  {
    id: "prop-colombo-2",
    title: "Galle Face Hotel",
    location: "Galle Face Green, Colombo",
    distance: "1.2 km from center",
    destinationId: "colombo",
    category: "beachfront",
    price: 145,
    taxes: 35,
    rating: 8.8,
    ratingText: "Fabulous",
    reviewsCount: 856,
    badge: "Heritage Gem",
    freeCancellation: true,
    urgentNote: "Only 2 rooms left at this price on our site",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPYnZ7osQSvF4OirWXqd4aPSpVde8ysCRcMx_rtXc6AnohmJCw7HE5rqmDUuz12tsa6r9PlJHex-KQv_jZnYBU-kpcrbtWZeB9sevnEtB6MdKmGKr-Pyssl18ZVDUdd49kKQFcQtmE2tvPW7RoW2zGNNdds8r4aCi76xNrZfHCY0fL8-45woPZm9evey79ih_Rgfb9WCZQpzMEkaCN6AFVq-DAZUYNqnDS2QZOSPcbBknmkYKlZ_dd",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Restaurant", "Bar", "Ocean Terrace", "Free WiFi", "Outdoor Pool"],
    specs: "2 Guests • Sea View Room • 40 m²",
    description: "Historic oceanfront landmark since 1864, offering classic Victorian elegance, sunset cocktails over the Indian Ocean, and world-class service."
  },
  {
    id: "prop-grand-horizon",
    title: "The Grand Horizon Suite",
    location: "125 Coastal Highway, Monterey, CA 93940",
    distance: "0.5 km from coast",
    destinationId: "monterey",
    category: "beachfront",
    price: 189,
    taxes: 38,
    rating: 4.9,
    ratingText: "Top rated property",
    reviewsCount: 312,
    badge: "Top rated property",
    freeCancellation: true,
    cancellationNote: "Free cancellation up to 48h before check-in.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzuBT4w39PhqaHsbEPn5zORMTij84gG4as8fS8T-rKDVKkAk4Ys8gLbyiK-40NmdBgogWjgcEbhKR0hYYm14C5IlF-oC6RWN-rFCXYLFty2XkiQ5gYhpvwwaFnSwiom_MDKXN6amweO4zxCl1b0MYJcuPEvw8bIIpTQ3foRJvlTn5xAYSGZQbB7sMYvDhxBpbHdYSp17KuADFFP_1myQpWqsVhSBgsc4YsX2DL1p_faXpMi7BtfoKg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2URQSBmTS3bK8n4ayXiGvkZzFgaFGvtYFDBMpyGgyWb6DI0jDjj8L4_RYF7zyHHl2v0l9GctomFmXcw3ioiuogNK-YaBJu3e1UM-x_L7JlOG6FkXMvgTdXFYKVobeTqf2G7ULGnftrq7pEqchkgVMjoUNoqgPs6w5wyFoR10i0NJ8BwYz0NugshjHxslVRwaAAwN8zTcxzQqxzdXa8aC2u4g1RDcKZm4iaHS8JsUo0PtlDWBbvNhN",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdPq31Tk5MaUOKsOjD_B-oIXk9xiujhy1L8EA6u4wJI4N8TisbwXUEhn4bWWqlQ7XtA27n44A5N-bemr9fhmr-MZ6j95Iec7uV_su_y2XJlFR99r4SgIorAq3rfEcy7RTfH8HrbKvIZN7wC5PopAQVbxTIVMFCrHQyki_6lE1QiV59lGK3pPTvqqkLJvNm862D48UHAwYmWSa3o_jWruvxmVs6c-17Q75_SvoJZy7kLsNjAN5D0mwQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAshafKJ4LbWfreQvf2x0RcCO9l2vdW-FRkdl991I3qULcYfC3ens5oN1YCOzbozM1XKgPN8p4hktIzBk-AfmRWysFQiswr0BpGRRzcrwSJhDhqiGkDqzuXey5OjbDmGefpYKreX1hLp-LjjicBqqk0pAr1CK92Ufev_hzQpzV61zXzbBbQHoYNYaEjv5MBsOU4rhxGUY6f_Wh1ThnyVxVecdVqwfY_dKQEuBl_QfBNjlV3SB08B0X7",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDc0uAWKucD6p6bObbBnAsrrFdImmlPvNsQYZiRf2xoI5As2LXxIfa-u4PX-v1F-HJbrMYeRazQ605_L9hui6lLJAuhH0_V63DhNjAhw2Fd90Z7jRNBT6gPdBudigAyxzs2-PgiuypullD8XO_5J9djj16XtTm50ysPT98XV4ciFHVx8_eGEjm0nir7QEfFncORSrHbkLs4Qfuds5ixqvX0gE-tlkKx6VZWcmE8_AYaxIk32635Mtzf"
    ],
    amenities: ["Free High-Speed WiFi", "Infinity Pool", "24/7 Gym", "Valet Parking", "On-site Dining"],
    specs: "4 Guests • 2 Bedrooms • 2 Baths • 120 m²",
    description: "Experience unparalleled luxury at The Grand Horizon Suite, where modern elegance meets coastal serenity. Nestled along the pristine shores of Monterey, this premium accommodation offers panoramic ocean views, meticulous design, and world-class amenities tailored for the discerning traveler. Whether you are seeking a tranquil retreat or a high-efficiency base for corporate engagements, our property provides a sophisticated sanctuary."
  },
  {
    id: "prop-1",
    title: "Aura Oceanfront Overwater Villa",
    location: "Maldives",
    destinationId: "maldives",
    category: "beachfront",
    price: 1250,
    rating: 9.6,
    ratingText: "Exceptional",
    reviewsCount: 142,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Infinity Pool", "Private Chef", "Overwater Deck", "Sea View", "Free High-Speed Wi-Fi", "Spa & Sauna"],
    specs: "4 Guests • 2 Bedrooms • 2 Baths • 280 m²",
    description: "Experience absolute luxury perched directly above the turquoise Indian Ocean lagoon. Includes glass floor viewing window, private infinity plunge pool, and dedicated 24/7 butler service."
  },
  {
    id: "prop-2",
    title: "Villa Paradiso Amalfi Cliffside",
    location: "Amalfi Coast, Italy",
    destinationId: "amalfi",
    category: "luxury-villas",
    price: 1850,
    rating: 9.8,
    ratingText: "Exceptional",
    reviewsCount: 98,
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Panoramic Terrace", "Private Yacht Dock", "Wine Cellar", "Ocean Pool", "Breakfast Included"],
    specs: "8 Guests • 4 Bedrooms • 5 Baths • 450 m²",
    description: "Perched dramatically above Positano, Villa Paradiso merges historic Italian craftsmanship with sleek contemporary amenities and breathtaking Mediterranean sunsets."
  },
  {
    id: "prop-3",
    title: "Le Grand Parisian Penthouse",
    location: "Paris, France",
    destinationId: "paris",
    category: "boutique-city",
    price: 920,
    rating: 9.2,
    ratingText: "Wonderful",
    reviewsCount: 210,
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Eiffel Tower View", "Private Rooftop Deck", "Concierge Service", "Design Fireplace", "Smart Home Tech"],
    specs: "4 Guests • 2 Bedrooms • 2 Baths • 160 m²",
    description: "Unrivaled views of the Eiffel Tower from your glass dining terrace. High ceiling Haussmann architecture filled with modern artwork."
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "Stayed in Tuscany, Italy",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "The villa in Tuscany exceeded all expectations. StaySphere's concierge arranged a private chef and wine tasting that made our anniversary unforgettable."
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Stayed in Tokyo, Japan",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "Booking a business trip to Tokyo was seamless. The boutique hotel recommendation was perfectly located and offered exceptional amenities."
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Stayed in Maldives",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    quote: "Our family vacation in the Maldives was flawless. The platform's interface is intuitive, and the property was exactly as stunning as the photos."
  }
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
  { code: "AED", symbol: "AED", label: "AED (AED)" }
];

export const LANGUAGES = [
  { code: "en", name: "English (US)" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" }
];
