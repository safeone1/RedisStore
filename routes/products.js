import express from "express";
import axios from "axios";
import qs from "querystring";
import { createClient } from "redis";
import session from "express-session";
import { RedisStore } from "connect-redis";

const route = express.Router();
const redis = createClient();
let redisConnected = false;

// Redis event handling
redis.on("connect", () => {
  console.log("Connected to Redis");
  redisConnected = true;
});
redis.on("connect", () => console.log("Connected to Redis"));

// Connect to Redis asynchronously
(async () => {
  try {
    await redis.connect();
    console.log("Redis connection established");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();
// Middleware to check Redis connection status
route.use((req, res, next) => {
  if (!redisConnected) {
    return res.status(500).json({ error: "Redis not connected" });
  }
  next();
});

// Middleware to set up sessions using Redis

const URL = "https://dummyjson.com/products";

// Middleware to set up sessions using Redis
route.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: "SafeOne",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Helper function to get data with Redis caching
async function get(url) {
  try {
    const cachedResponse = await redis.get(url);
    if (cachedResponse) {
      console.log("HIT");
      return JSON.parse(cachedResponse);
    }

    console.log("MISS");
    const response = await axios.get(url);
    await redis.set(url, JSON.stringify(response.data), {
      EX: 10, // Set expiration time to 10 seconds
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

route.get("/cart", (req, res) => {
  if (!req.session.cart) {
    return res.status(200).json({ message: "Cart is empty", cart: [] });
  }
  res.json({ cart: req.session.cart || [] });
});
// Route to fetch products with query parameters
route.get("/", async (req, res) => {
  try {
    const q = qs.encode(req.query);
    const url = `${URL}?${q}`;
    const response = await get(url);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Route to fetch a product by ID

// Add a product to the cart
route.post("/cart", (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const existingProductIndex = req.session.cart.findIndex(
    (item) => item.productId === productId
  );

  if (existingProductIndex !== -1) {
    req.session.cart[existingProductIndex].quantity += quantity;
  } else {
    req.session.cart.push({ productId, quantity });
  }

  res.json({ message: "Product added to cart", cart: req.session.cart });
});

// Display the cart contents

// Remove a product from the cart
route.delete("/cart/:productId", (req, res) => {
  const { productId } = req.params;

  if (!req.session.cart) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  req.session.cart = req.session.cart.filter(
    (item) => item.productId !== productId
  );

  res.json({ message: "Product removed from cart", cart: req.session.cart });
});

route.get("/:id", async (req, res) => {
  try {
    const url = `${URL}/${req.params.id}`;
    const response = await get(url);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default route;
