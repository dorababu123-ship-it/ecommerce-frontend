# ShopMate E-Commerce API Quick Reference

## Base URL

```
http://localhost:5000
```

## Authentication

All endpoints except authentication and public routes require:

```
Authorization: Bearer {jwt_token}
```

---

## AUTHENTICATION (/api/auth)

### Register

```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
→ Returns: { _id, name, email, role, token }
```

### Login

```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
→ Returns: { _id, name, email, role, token }
```

### Get Profile (🔒 Auth Required)

```
GET /api/auth/profile
→ Returns: { _id, name, email, role }
```

### Update Profile (🔒 Auth Required)

```
PUT /api/auth/profile
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword"
}
→ Returns: Updated user object
```

---

## PRODUCTS (/api/products)

### Get All Products (Search/Filter/Sort)

```
GET /api/products?search=shirt&category=Clothing&minPrice=100&maxPrice=1000&sort=price-asc
→ Returns: { products: [...], categories: [...] }

Query Options:
  - search: Search by name/description
  - category: Filter by category
  - minPrice: Minimum price range
  - maxPrice: Maximum price range
  - sort: price-asc | price-desc (default: newest)
```

### Get Product by ID

```
GET /api/products/:id
→ Returns: { _id, name, price, description, image, category, createdAt, ...}
```

### Create Product (🔒 Admin Only)

```
POST /api/products
{
  "name": "T-Shirt",
  "price": 399,
  "description": "Cotton t-shirt",
  "image": "url_to_image",
  "category": "Clothing"
}
→ Returns: Created product object
```

### Update Product (🔒 Admin Only)

```
PUT /api/products/:id
{
  "name": "Updated Name",
  "price": 499,
  "description": "Updated description"
}
→ Returns: Updated product object
```

### Delete Product (🔒 Admin Only)

```
DELETE /api/products/:id
→ Returns: { message: "Product deleted" }
```

---

## CART (/api/cart) - 🔒 All Require Auth

### Get Cart

```
GET /api/cart
→ Returns: { items: [{product: {...}, quantity: 2}], total: 798 }
```

### Add to Cart

```
POST /api/cart
{
  "productId": "63f7a1b2c3d4e5f6g7h8",
  "quantity": 2
}
→ Returns: { items: [...], total: ... }
```

### Update Cart Item Quantity

```
PUT /api/cart/:productId
{
  "quantity": 5
}
→ Returns: { items: [...], total: ... }
```

### Remove Item from Cart

```
DELETE /api/cart/:productId
→ Returns: { items: [...], total: ... }
```

### Clear Cart

```
DELETE /api/cart
→ Returns: { items: [], total: 0 }
```

---

## ORDERS (/api/orders) - 🔒 All Require Auth

### Create Order

```
POST /api/orders
{
  "orderItems": [
    {
      "product": "63f7a1b2c3d4e5f6g7h8",
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
}
→ Returns: Created order object with status "Processing"
```

### Get My Orders

```
GET /api/orders/myorders
→ Returns: Array of user's orders sorted by newest first
```

### Get Order Details

```
GET /api/orders/:orderId
→ Returns: Order object with user and product details
```

### Update Order to Paid

```
PUT /api/orders/:orderId/pay
{
  "id": "payment_id",
  "status": "completed",
  "update_time": "2024-01-15T10:30:00Z",
  "email_address": "user@example.com"
}
→ Returns: Updated order with isPaid: true
```

### Get All Orders (🔒 Admin Only)

```
GET /api/orders
→ Returns: Array of all orders with user and product details
```

### Mark as Delivered (🔒 Admin Only)

```
PUT /api/orders/:orderId/deliver
→ Returns: Updated order with isDelivered: true, status: "Delivered"
```

### Update Order Status (🔒 Admin Only)

```
PUT /api/orders/:orderId/status
{
  "status": "Processing" | "Shipped" | "Delivered" | "Cancelled"
}
→ Returns: Updated order object
```

---

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized/Invalid Token
- `404` - Not Found
- `500` - Server Error

## Error Response Format

```
{
  "message": "Error description"
}
```

## Success Response Examples

### Successful Authentication

```json
{
  "_id": "63f7a1b2c3d4e5f6g7h8",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Successful Product Response

```json
{
  "_id": "63f7a1b2c3d4e5f6g7h8",
  "name": "Classic White T-Shirt",
  "price": 399,
  "description": "Comfortable and stylish white t-shirt",
  "image": "https://images.unsplash.com/...",
  "category": "Clothing",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Successful Cart Response

```json
{
  "items": [
    {
      "_id": "63f8d9c4e5f6g7h8i9j0",
      "product": {
        "_id": "63f7a1b2c3d4e5f6g7h8",
        "name": "T-Shirt",
        "price": 399,
        "image": "url"
      },
      "quantity": 2
    }
  ],
  "total": 798
}
```

---

## Common Workflows

### 1. User Registration & Login

1. POST /api/auth/register
2. Save token from response
3. Use token for all future authenticated requests

### 2. Browse & Checkout

1. GET /api/products (with filters/search)
2. GET /api/products/:id (view details)
3. POST /api/cart (add items)
4. GET /api/cart (view cart)
5. PUT /api/cart/:productId (update quantities)
6. POST /api/orders (create order)

### 3. Track Orders

1. GET /api/orders/myorders (list all orders)
2. GET /api/orders/:orderId (view order details)
3. Wait for admin to update status
4. Check PUT /api/orders/:orderId/status in admin panel

### 4. Admin Product Management

1. POST /api/products (add new product)
2. GET /api/products/:id (view details)
3. PUT /api/products/:id (update product)
4. DELETE /api/products/:id (remove product)

---

## Testing with cURL Examples

### Login & Save Token

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' | jq -r '.token')
echo $TOKEN
```

### Use Token in Request

```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

### Get Product List

```bash
curl "http://localhost:5000/api/products?category=Clothing&sort=price-asc"
```
