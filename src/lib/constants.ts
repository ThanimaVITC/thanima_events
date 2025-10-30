export const DEPARTMENTS = [
  "Logistics",
  "Events",
  "Marketing",
  "Media",
  "Design",
  "Tech",
] as const;

export const TSHIRT_DESIGNS = [
  {
    name: "Member Exclusive",
    value: "member-exclusive",
    description: "Exclusive design for Thanima members only",
    imageUrl: "/tshirts-mockup/IMG-20251028-WA0152.jpg",
    membersOnly: true,
  },
  {
    name: "Classic Design",
    value: "classic-design",
    description: "Available for everyone",
    imageUrl: "/tshirts-mockup/IMG-20251028-WA0152 copy.jpg",
    membersOnly: false,
  },
  {
    name: "Modern Design",
    value: "modern-design",
    description: "Available for everyone",
    imageUrl: "/tshirts-mockup/IMG-20251028-WA0152 copy.jpg",
    membersOnly: false,
  },
] as const;

export const TSHIRT_DESIGN_VALUES = ["member-exclusive", "classic-design", "modern-design"] as const;

export const TSHIRT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export const BASE_PRICE = 399;
export const SERVICE_CHARGE = 50;
