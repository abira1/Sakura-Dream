export const menuItems = [
  {
    id: 1,
    name: "抹茶ラテ • Matcha Latte",
    description: "Premium ceremonial matcha with steamed milk",
    price: "¥650",
    icon: "Coffee"
  },
  {
    id: 2,
    name: "桜茶 • Sakura Tea",
    description: "Delicate cherry blossom infused green tea",
    price: "¥550",
    icon: "Flower2"
  },
  {
    id: 3,
    name: "ほうじ茶ラテ • Hojicha Latte",
    description: "Roasted green tea with creamy foam",
    price: "¥600",
    icon: "Cup"
  },
  {
    id: 4,
    name: "柚子チーズケーキ • Yuzu Cake",
    description: "Light Japanese citrus cheesecake",
    price: "¥750",
    icon: "Cake"
  },
  {
    id: 5,
    name: "もち三種 • Mochi Trio",
    description: "Matcha, strawberry, and vanilla mochi",
    price: "¥800",
    icon: "Cookie"
  },
  {
    id: 6,
    name: "鯛焼き • Taiyaki",
    description: "Fish-shaped waffle with red bean filling",
    price: "¥500",
    icon: "Fish"
  }
];

export const mockReservation = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock reservation created:", data);
      resolve({ success: true, data });
    }, 1000);
  });
};