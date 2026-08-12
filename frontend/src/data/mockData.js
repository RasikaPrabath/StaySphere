export const FEATURED_COLLECTIONS = [
  {
    id: "beachfront",
    title: "Beachfront Resorts & Villas",
    count: "450+ stays",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tag: "Coastal Escapes",
    description: "Sun-drenched oceanfront villas and luxury beach resorts in Galle, Bentota, Weligama & Tangalle."
  },
  {
    id: "luxury-villas",
    title: "Heritage & Boutique Estates",
    count: "320+ stays",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    tag: "Colonial Luxury",
    description: "Restored 17th-century Dutch villas, private butler estates, and boutique sanctuaries."
  },
  {
    id: "mountain-retreats",
    title: "Hill Country & Tea Chalets",
    count: "280+ stays",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    tag: "Highland Sanctuaries",
    description: "Misty mountain lodges, fireside bungalows, and tea plantation suites in Nuwara Eliya & Ella."
  },
  {
    id: "boutique-city",
    title: "Urban Luxury & Harbor Hotels",
    count: "390+ stays",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    tag: "City Sophistication",
    description: "5-star skyline hotels and ocean-view luxury suites in the heart of Colombo."
  }
];

export const TRENDING_DESTINATIONS = [
  {
    id: "colombo",
    name: "Colombo",
    country: "Sri Lanka",
    stays: "120+ stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant coastal capital featuring 5-star harbor hotels, colonial dining, and oceanfront suites."
  },
  {
    id: "galle",
    name: "Galle",
    country: "Sri Lanka",
    stays: "95+ stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
    description: "UNESCO World Heritage Dutch fort, private rampart villas, and turquoise beach bays."
  },
  {
    id: "kandy",
    name: "Kandy",
    country: "Sri Lanka",
    stays: "80+ stays",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1588598198321-9735fd524557?auto=format&fit=crop&w=800&q=80",
    description: "Scenic sacred hill capital with serene lakefront retreats and luxury river sanctuaries."
  },
  {
    id: "ella",
    name: "Ella",
    country: "Sri Lanka",
    stays: "110+ stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
    description: "Panoramic cloud forest lodges, nine arch views, and mountain wellness resorts."
  },
  {
    id: "sigiriya",
    name: "Sigiriya & Dambulla",
    country: "Sri Lanka",
    stays: "65+ stays",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
    description: "Ancient rock fortress views, luxury lakefront eco-villas, and jungle retreats."
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    country: "Sri Lanka",
    stays: "75+ stays",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
    description: "Little England tea estate bungalows, fireside suites, and highland golf resorts."
  },
  {
    id: "weligama",
    name: "Weligama & Mirissa",
    country: "Sri Lanka",
    stays: "90+ stays",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Prime surfing bays, luxury oceanfront infinity pools, and whale watching resorts."
  },
  {
    id: "bentota",
    name: "Bentota",
    country: "Sri Lanka",
    stays: "85+ stays",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    description: "Golden sand beach resorts, river lagoon villas, and water sport retreats."
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
    rating: 9.4,
    ratingText: "Exceptional",
    reviewsCount: 1245,
    badge: "Top Pick",
    freeCancellation: true,
    cancellationNote: "Free cancellation up to 24h before check-in.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Pool", "Free WiFi", "Spa & Wellness", "Fitness Center", "Fine Dining", "Valet Parking"],
    specs: "2 Guests • 1 Executive Suite • 52 m²",
    description: "A premier 5-star urban oasis in the heart of Colombo. Features award-winning international restaurants, dual outdoor swimming pools, and tranquil wellness spas."
  },
  {
    id: "prop-colombo-2",
    title: "Galle Face Hotel Heritage Suite",
    location: "Galle Face Green, Colombo",
    distance: "1.2 km from center",
    destinationId: "colombo",
    category: "beachfront",
    price: 210,
    originalPrice: 260,
    taxes: 40,
    rating: 9.2,
    ratingText: "Superb",
    reviewsCount: 980,
    badge: "Heritage Gem",
    freeCancellation: true,
    urgentNote: "Only 2 ocean-view suites left for your dates",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Ocean Terrace", "Historic Bar", "Seawater Pool", "Free High-Speed WiFi", "24/7 Butler"],
    specs: "2 Guests • Sea View Suite • 48 m²",
    description: "Historic oceanfront landmark established in 1864, offering timeless Victorian elegance, famous sunset cocktails over the Indian Ocean, and world-class hospitality."
  },
  {
    id: "prop-galle-1",
    title: "Amangalla Fort Luxury Sanctuary",
    location: "Dutch Fort, Galle",
    distance: "0.1 km from Fort Center",
    destinationId: "galle",
    category: "luxury-villas",
    price: 450,
    originalPrice: 520,
    taxes: 75,
    rating: 9.8,
    ratingText: "Extraordinary",
    reviewsCount: 340,
    badge: "UNESCO Heritage",
    freeCancellation: true,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Ayurvedic Spa", "Hydrotherapy Baths", "Verandah Dining", "Private Courtyard", "Free WiFi"],
    specs: "2 Guests • 1 Heritage Suite • 65 m²",
    description: "Nestled within Galle Fort's 17th-century ramparts, Amangalla captures colonial grandeur with polished teak floors, antique furnishings, and bespoke wellness treatments."
  },
  {
    id: "prop-ella-1",
    title: "98 Acres Mountain Resort & Spa",
    location: "Passara Road, Ella",
    distance: "1.8 km from Ella Town",
    destinationId: "ella",
    category: "mountain-retreats",
    price: 320,
    originalPrice: 380,
    taxes: 50,
    rating: 9.6,
    ratingText: "Exceptional",
    reviewsCount: 860,
    badge: "Eco Luxury",
    freeCancellation: true,
    images: [
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Panoramic Pool", "Helipad Access", "Organic Dining", "Tea Tasting", "Mountain Views"],
    specs: "2 Guests • Deluxe Chalet • 55 m²",
    description: "An elegant eco-resort built on a 98-acre tea estate in Ella. Enjoy stunning views of Little Adam's Peak, private chalet balconies, and pristine mountain tranquility."
  },
  {
    id: "prop-kandy-1",
    title: "Earl's Regency Hotel & River Spa",
    location: "Tennekumbura, Kandy",
    distance: "3.5 km from Kandy Lake",
    destinationId: "kandy",
    category: "boutique-city",
    price: 175,
    originalPrice: 210,
    taxes: 30,
    rating: 9.1,
    ratingText: "Superb",
    reviewsCount: 650,
    badge: "Popular Pick",
    freeCancellation: true,
    images: [
      "https://images.unsplash.com/photo-1588598198321-9735fd524557?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Mahaweli River View", "Lagoon Pool", "Ayurvedic Spa", "Tennis Court", "Free WiFi"],
    specs: "2 Guests • Deluxe Room • 42 m²",
    description: "Surrounded by lush Knuckles mountain ranges and the Mahaweli River, Earl's Regency delivers 5-star luxury combined with authentic Sri Lankan hospitality."
  },
  {
    id: "prop-nuwaraeliya-1",
    title: "Ceylon Tea Trails - Castlereagh Bungalow",
    location: "Hatton, Nuwara Eliya",
    distance: "Highland Tea Country",
    destinationId: "nuwara-eliya",
    category: "mountain-retreats",
    price: 680,
    originalPrice: 790,
    taxes: 90,
    rating: 9.9,
    ratingText: "Flawless",
    reviewsCount: 290,
    badge: "Relais & Châteaux",
    freeCancellation: true,
    images: [
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Private Butler", "Lakefront Garden", "All-Inclusive Dining", "Croquet Lawn", "Fireplace"],
    specs: "2 Guests • Master Suite • 70 m²",
    description: "Restored colonial tea planter bungalows overlooking Castlereagh Lake. Features gourmet high teas, private butler service, and scenic lakeside gardens."
  },
  {
    id: "prop-weligama-1",
    title: "Weligama Bay Marriott Resort & Spa",
    location: "Pelena, Weligama",
    distance: "0.2 km from Beach",
    destinationId: "weligama",
    category: "beachfront",
    price: 240,
    originalPrice: 290,
    taxes: 45,
    rating: 9.3,
    ratingText: "Superb",
    reviewsCount: 1120,
    badge: "Best Ocean View",
    freeCancellation: true,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["100% Ocean View Rooms", "Rooftop Lounge", "3 Outdoor Pools", "Quan Spa", "Kids Club"],
    specs: "2 Guests • Ocean View Room • 46 m²",
    description: "Towering right on Weligama Bay with breathtaking 180-degree ocean views from every room. Perfect for surfing enthusiasts, families, and beach lovers."
  },
  {
    id: "prop-sigiriya-1",
    title: "Heritance Kandalama Eco Lodge",
    location: "Kandalama, Dambulla",
    distance: "12 km from Sigiriya Rock",
    destinationId: "sigiriya",
    category: "luxury-villas",
    price: 260,
    originalPrice: 310,
    taxes: 40,
    rating: 9.5,
    ratingText: "Exceptional",
    reviewsCount: 1410,
    badge: "Geoffrey Bawa Masterpiece",
    freeCancellation: true,
    images: [
      "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: ["Infinity Pool facing Sigiriya", "Six Continents Spa", "Jungle Terrace", "Bird Watching", "Free WiFi"],
    specs: "2 Guests • Luxury Room • 45 m²",
    description: "Designed by legendary architect Geoffrey Bawa, this iconic eco-hotel nestles into a cliffside overgrown with lush jungle overlooking the Kandalama Lake."
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Kavindu Fernando",
    location: "Stayed at 98 Acres, Ella",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "Booking our anniversary stay in Ella through StaySphere was so simple. The direct confirmation and special room upgrade made our trip unforgettable!"
  },
  {
    id: 2,
    name: "Sarah & David Miller",
    location: "Stayed at Galle Fort Heritage Villa",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "StaySphere gave us the best rate guarantee for our Sri Lanka holiday. The heritage villa in Galle was spectacular and exactly as shown."
  },
  {
    id: 3,
    name: "Praveen Wickramasinghe",
    location: "Stayed at Cinnamon Grand, Colombo",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote: "As a frequent business traveler across Sri Lanka, StaySphere is my trusted platform for instant hotel bookings and seamless owner management."
  }
];

export const CURRENCIES = [
  { code: "LKR", symbol: "Rs.", label: "LKR (Rs.)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" }
];

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "si", name: "සිංහල (Sinhala)" },
  { code: "ta", name: "தமிழ் (Tamil)" }
];
