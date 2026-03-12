# Backend Setup & Testing Guide

## Quick Start

### 1. Prerequisites

- Node.js installed
- MongoDB running locally (or update MONGODB_URI in .env)
- npm or yarn package manager

### 2. Installation

```bash
cd "E-commerce back-end"
npm install
```

### 3. Environment Configuration

The `.env` file is already configured with:

- PORT: 5000
- MongoDB: mongodb://127.0.0.1:27017/ecommerce
- JWT_SECRET: shopmate_secret_key_2024_change_in_production

Update these values for your environment if needed.

### 4. Database Setup

```bash
# Seed database with sample products and users
npm run seed
```

This creates:

- **Admin User**: admin@shopmate.com / admin123
- **Sample User**: john@example.com / password123
- **12 Sample Products** in categories: Clothing, Footwear, Electronics, Accessories

### 5. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on: `http://localhost:5000`

## Testing API Endpoints

### Using cURL

#### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah",
    "email": "sarah@example.com",
    "password": "password123"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "password123"
  }'
```

Save the token from response for authenticated requests.

#### 3. Get Products (No Auth Required)

```bash
# All products
curl http://localhost:5000/api/products

# Search products
curl "http://localhost:5000/api/products?search=shirt"

# Filter by category
curl "http://localhost:5000/api/products?category=Footwear"

# Price range filter
curl "http://localhost:5000/api/products?minPrice=500&maxPrice=2000"

# Sort by price (ascending)
curl "http://localhost:5000/api/products?sort=price-asc"
```

#### 4. Get Product Details

```bash
curl http://localhost:5000/api/products/{productId}
```

#### 5. Get Cart (With Auth)

Replace `YOUR_TOKEN` with the token from login response:

```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 6. Add to Cart

```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

#### 7. Update Cart Item Quantity

```bash
curl -X PUT http://localhost:5000/api/cart/{productId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"quantity": 5}'
```

#### 8. Remove from Cart

```bash
curl -X DELETE http://localhost:5000/api/cart/{productId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 9. Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderItems": [
      {
        "product": "PRODUCT_ID",
        "quantity": 2,
        "price": 399
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "COD",
    "itemsPrice": 798,
    "shippingPrice": 100,
    "totalPrice": 898
  }'
```

#### 10. Get My Orders

```bash
curl -X GET http://localhost:5000/api/orders/myorders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create a new collection "ShopMate API"
2. Add variable: `{{baseUrl}}` = `http://localhost:5000`
3. Add variable: `{{token}}` = (set after login)
4. Import or recreate requests from cURL examples above
5. Use `{{baseUrl}}` prefix for all URLs
6. Use `{{token}}` for Authorization headers

### Testing Flow

1. **Test Registration & Login**
   - Register new user
   - Login with credentials
   - Copy token to variable

2. **Test Products**
   - Get all products
   - Search products
   - Filter by category
   - Get single product

3. **Test Cart Operations**
   - Add product to cart
   - View cart
   - Update quantity
   - Remove item
   - Clear cart

4. **Test Orders**
   - Create order from cart items
   - View my orders
   - View order details

5. **Admin Features** (login as admin@shopmate.com)
   - Create product
   - Update product
   - Delete product
   - View all orders
   - Update order status

## Troubleshooting

### MongoDB Connection Error

```
MongoDB Connection Failed: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Make sure MongoDB is running:

- Windows: Run MongoDB service or start mongod manually
- Mac: `brew services start mongodb-community`
- Linux: `sudo service mongod start`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**: Change PORT in .env or kill the process using port 5000

### Token Expired/Invalid

- Tokens expire after 30 days (see JWT configuration)
- Re-login to get a new token
- Make sure Authorization header format is: `Bearer {token}`

### CORS Errors

If frontend can't connect to backend, check:

1. Backend CORS origins in `server.js`
2. Update CORS origins if frontend running on different port
3. Include credentials in frontend fetch: `credentials: 'include'`

## Database Information

### Collections

- **users**: Stores user accounts and roles
- **products**: Product catalog
- **carts**: User shopping carts
- **orders**: Order history

### Sample Query Commands

```bash
# Connect to MongoDB
mongosh

# Switch to ecommerce database
use ecommerce

# View all products
db.products.find()

# View all users
db.users.find()

# Count products by category
db.products.aggregate([{$group: {_id: "$category", count: {$sum: 1}}}])
```

## Development Tips

1. **Hot Reload**: Use `npm run dev` to automatically restart on file changes
2. **Console Logs**: Add `console.log()` to debug issues
3. **MongoDB Compass**: Use MongoDB Compass GUI to view database
4. **Postman**: Save requests for repetitive testing
5. **Network Tab**: Check request/response in browser DevTools

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [JWT Authentication](https://jwt.io/)
- [Mongoose Documentation](https://mongoosejs.com/)

## Support

For issues or questions:

1. Check error messages in terminal
2. Review MongoDB connection status
3. Verify .env configuration
4. Check CORS settings for frontend origin
5. Ensure all dependencies installed: `npm install`
