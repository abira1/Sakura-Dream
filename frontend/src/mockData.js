export const menuItems = [
  {
    id: 1,
    name: "Matcha Latte",
    description: "Premium ceremonial matcha with steamed milk",
    price: "$6.50",
    image: "🍵"
  },
  {
    id: 2,
    name: "Sakura Tea",
    description: "Delicate cherry blossom infused green tea",
    price: "$5.50",
    image: "🌸"
  },
  {
    id: 3,
    name: "Hojicha Latte",
    description: "Roasted green tea with creamy foam",
    price: "$6.00",
    image: "☕"
  },
  {
    id: 4,
    name: "Yuzu Cheesecake",
    description: "Light Japanese citrus cheesecake",
    price: "$7.50",
    image: "🍰"
  },
  {
    id: 5,
    name: "Mochi Trio",
    description: "Matcha, strawberry, and vanilla mochi",
    price: "$8.00",
    image: "🍡"
  },
  {
    id: 6,
    name: "Taiyaki",
    description: "Fish-shaped waffle with red bean filling",
    price: "$5.00",
    image: "🐟"
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