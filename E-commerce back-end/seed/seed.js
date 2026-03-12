const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
require("dotenv").config();

const sampleProducts = [
  {
    name: "Classic White T-Shirt",
    price: 399,
    description: "Comfortable and stylish white t-shirt made from 100% cotton. Perfect for casual wear.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "Clothing",
  },
  {
    name: "Black Hoodie",
    price: 899,
    description: "Warm and cozy black hoodie with front pocket. Ideal for layering in cold weather.",
    image: "https://images.meesho.com/images/products/59924591/k7m0s_512.avif?width=512",
    category: "Clothing",
  },
  {
    name: "Blue Denim Jacket",
    price: 1499,
    description: "Classic blue denim jacket with a modern fit. Great for all seasons.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    category: "Clothing",
  },
  {
    name: "Running Shoes",
    price: 2499,
    description: "High-performance running shoes with excellent cushioning and support.",
    image: "https://images.meesho.com/images/products/478801134/qnmek_512.avif?width=512",
    category: "Footwear",
  },
  {
    name: "White Sneakers",
    price: 1999,
    description: "Clean and modern white sneakers perfect for everyday wear.",
    image: "https://m.media-amazon.com/images/I/6157WaPyAyL._SY625_.jpg",
    category: "Footwear",
  },
  {
    name: "Formal Leather Shoes",
    price: 2999,
    description: "Elegant formal leather shoes suitable for business meetings and special occasions.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    category: "Footwear",
  },
  {
    name: "Wireless Headphones",
    price: 3499,
    description: "Premium wireless headphones with noise cancellation and long battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Electronics",
  },
  {
    name: "Smart Watch",
    price: 4999,
    description: "Feature-rich smartwatch with fitness tracking and smartphone integration.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Electronics",
  },
  {
    name: "Laptop Backpack",
    price: 1299,
    description: "Durable laptop backpack with multiple compartments and comfortable padding.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    category: "Accessories",
  },
  {
    name: "Sunglasses",
    price: 899,
    description: "Stylish sunglasses with UV protection and polarized lenses.",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
    category: "Accessories",
  },
  {
    name: "Winter Jacket",
    price: 3999,
    description: "Heavy-duty winter jacket with insulation and water-resistant exterior.",
    image: "https://images.unsplash.com/photo-1541364987981-f8e269b5d9c0",
    category: "Clothing",
  },
  {
    name: "Sports Shoes",
    price: 1799,
    description: "Versatile sports shoes perfect for gym workouts and outdoor activities.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Footwear",
  },
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce");

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@shopmate.com",
      password: "admin123",
      role: "admin",
    });
    await adminUser.save();
    console.log("✅ Created admin user");

    // Create sample user
    const sampleUser = new User({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
    });
    await sampleUser.save();
    console.log("✅ Created sample user");

    console.log("🌱 Database seeded successfully!");
    console.log("Admin login: admin@shopmate.com / admin123");
    console.log("Sample user: john@example.com / password123");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
