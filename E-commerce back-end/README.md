# ShopMate E-Commerce Backend

Complete backend API for ShopMate e-commerce application with authentication, product management, cart functionality, and order processing.

## Features

- **Authentication**: User registration, login, JWT-based authentication
- **Products**: CRUD operations, search, filtering, and sorting
- **Cart**: Add/remove items, update quantities, calculate totals
- **Orders**: Create orders, track status, payment processing
- **Admin Features**: Manage products, view all orders, update order status

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:

   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
   NODE_ENV=development
   ```

4. Make sure MongoDB is running on your system

5. Start the backend:
   - Development mode (with hot reload):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## Database Setup

1. Seed the database with sample data:

   ```bash
   npm run seed
   ```

   This will create:
   - 12 sample products in various categories
   - Admin user: `admin@shopmate.com` / `admin123`
   - Sample user: `john@example.com` / `password123`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User

- **POST** `/api/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: User object with JWT token

#### Login User

- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: User object with JWT token

#### Get Profile

- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: User profile

#### Update Profile

- **PUT** `/api/auth/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ name, email, password }`
- **Response**: Updated user object

### Product Routes (`/api/products`)

#### Get All Products

- **GET** `/api/products`
- **Query Parameters**:
  - `search` - Search by name/description
  - `category` - Filter by category
  - `minPrice` - Minimum price
  - `maxPrice` - Maximum price
  - `sort` - Sort option (price-asc, price-desc)
- **Response**: Array of products with categories

#### Get Product by ID

- **GET** `/api/products/:id`
- **Response**: Product details

#### Create Product (Admin Only)

- **POST** `/api/products`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ name, price, description, image, category }`
- **Response**: Created product

#### Update Product (Admin Only)

- **PUT** `/api/products/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: Fields to update
- **Response**: Updated product

#### Delete Product (Admin Only)

- **DELETE** `/api/products/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Success message

### Cart Routes (`/api/cart`)

#### Get Cart

- **GET** `/api/cart`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Cart items and total price

#### Add to Cart

- **POST** `/api/cart`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ productId, quantity }`
- **Response**: Updated cart

#### Update Cart Item

- **PUT** `/api/cart/:productId`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ quantity }`
- **Response**: Updated cart

#### Remove from Cart

- **DELETE** `/api/cart/:productId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Updated cart

#### Clear Cart

- **DELETE** `/api/cart`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Empty cart confirmation

### Order Routes (`/api/orders`)

#### Create Order

- **POST** `/api/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "orderItems": [{ "product": "productId", "quantity": 2, "price": 100 }],
    "shippingAddress": { "address", "city", "postalCode", "country" },
    "paymentMethod": "COD",
    "itemsPrice": 200,
    "shippingPrice": 50,
    "totalPrice": 250
  }
  ```
- **Response**: Created order

#### Get My Orders

- **GET** `/api/orders/myorders`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of user's orders

#### Get Order by ID

- **GET** `/api/orders/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Order details

#### Update Order to Paid

- **PUT** `/api/orders/:id/pay`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ id, status, update_time, email_address }`
- **Response**: Updated order

#### Get All Orders (Admin Only)

- **GET** `/api/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of all orders

#### Update Order to Delivered (Admin Only)

- **PUT** `/api/orders/:id/deliver`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Updated order

#### Update Order Status (Admin Only)

- **PUT** `/api/orders/:id/status`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ "status": "Processing|Shipped|Delivered|Cancelled" }`
- **Response**: Updated order

## Database Models

### User Schema

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user|admin),
  timestamps: true
}
```

### Product Schema

```javascript
{
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  timestamps: true
}
```

### Cart Schema

```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number
  }],
  timestamps: true
}
```

### Order Schema

```javascript
{
  user: ObjectId (ref: User),
  orderItems: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String (COD|Card|UPI),
  itemsPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  isDelivered: Boolean,
  status: String,
  timestamps: true
}
```

## Security Best Practices

1. **JWT Secret**: Change the default JWT_SECRET in production
2. **CORS**: Update CORS origin URLs for production
3. **Environment Variables**: Never commit `.env` file
4. **Password**: Passwords are hashed with bcryptjs
5. **Auth Middleware**: All protected routes verify JWT tokens

## CORS Configuration

The backend is configured to accept requests from:

- `http://localhost:5500` (local frontend)
- `http://127.0.0.1:5500`
- `http://localhost:3000`

Update the CORS origin in `server.js` for production deployment.

## Error Handling

All API responses follow this format:

- **Success**: `{ data: {...} }`
- **Error**: `{ message: "error description" }`
- **Status Codes**:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 404: Not Found
  - 500: Server Error

## Testing the API

Use tools like Postman or cURL to test the API:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Products
curl http://localhost:5000/api/products

# Get Products with filters
curl "http://localhost:5000/api/products?category=Clothing&sort=price-asc"
```

## Project Structure

```
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   └── auth.js           # JWT verification, admin check
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── seed/
│   └── seed.js           # Database seeding
├── server.js             # Main server file
├── .env                  # Environment variables
└── package.json
```

## License

ISC

- Sample user: `john@example.com` / `password123`

## Running the Server

### Development mode (with auto-restart):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products

- `GET /api/products` - Get all products with search/filter
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart

- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:productId` - Update cart item quantity (protected)
- `DELETE /api/cart/:productId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders

- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/myorders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/pay` - Update order to paid (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/deliver` - Mark order as delivered (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Query Parameters

### Products endpoint supports:

- `search` - Search in name, description, category
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sort` - Sort options: `price-asc`, `price-desc`, `default`

Example:

```
GET /api/products?search=shirt&category=Clothing&maxPrice=1000&sort=price-asc
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message field with details.

## Project Structure

```
E-commerce back-end/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── cartController.js  # Cart operations
│   ├── orderController.js # Order management
│   └── productController.js # Product operations
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Cart.js            # Cart schema
│   └── Order.js           # Order schema
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── cartRoutes.js      # Cart routes
│   ├── orderRoutes.js     # Order routes
│   └── productRoutes.js   # Product routes
├── seed/
│   └── seed.js            # Database seeding script
├── server.js              # Main server file
├── package.json
└── README.md
```

## Development Notes

- The backend uses MongoDB for data storage
- Passwords are hashed using bcryptjs
- JWT tokens expire after 30 days
- All dates are stored in UTC
- Image URLs are stored as strings (no file upload included)

## License

ISC
