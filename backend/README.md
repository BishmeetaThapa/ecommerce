# EverGlow E-Commerce Backend

A robust Express.js backend API for the EverGlow Beauty e-commerce platform.

---

## 🏗️ Project Structure

```
backend/
├── server.js                 # Application entry point
├── package.json              # Dependencies
├── .env                      # Environment variables (not committed)
│
└── src/
    ├── controllers/          # Request handlers
    │   ├── auth.js          # Authentication (register, login, password reset)
    │   ├── brand.js         # Brand management
    │   ├── category.js     # Category management
    │   ├── order.js         # Order processing
    │   ├── product.js       # Product management
    │   └── review.js        # Review system
    │
    ├── models/              # Mongoose schemas
    │   ├── brand.js
    │   ├── category.js
    │   ├── order.js
    │   ├── product.js
    │   ├── review.js
    │   └── user.js
    │
    ├── routes/              # API route definitions
    │   ├── auth.js
    │   ├── brand.js
    │   ├── category.js
    │   ├── order.js
    │   ├── product.js
    │   ├── review.js
    │   └── user.js
    │
    ├── middleware/          # Custom middleware
    │   └── auth.js          # JWT authentication
    │
    ├── db/                  # Database connection
    │   └── connect.js
    │
    └── utils/               # Utility functions
        └── email.js         # Nodemailer email service
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer

---

## ✅ Features

### Authentication
- User registration with role-based access (admin/customer)
- Secure login with JWT tokens
- Password reset with email verification
- Protected routes with middleware

### Product Management
- Full CRUD operations for products
- Category and brand filtering
- Product search and sorting

### Order Processing
- Order creation and tracking
- Multiple payment methods (COD, card)
- Order status management (pending → processing → shipped → delivered)
- Return request handling

### User Management
- Admin dashboard access
- User profile management
- Order history

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Email Configuration (Nodemailer)
# For Gmail: Use App Password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Email From Address
EMAIL_FROM="EverGlow Beauty" <noreply@everglow.com>
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get all categories | No |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Brands
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/brands` | Get all brands | No |
| POST | `/api/brands` | Create brand | Admin |
| PUT | `/api/brands/:id` | Update brand | Admin |
| DELETE | `/api/brands/:id` | Delete brand | Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Get user orders | Yes |
| GET | `/api/orders/:id` | Get single order | Yes |
| POST | `/api/orders` | Create new order | Yes |
| PUT | `/api/orders/:id` | Update order status | Admin |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reviews/product/:productId` | Get product reviews | No |
| POST | `/api/reviews` | Create review | Yes |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

---

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'admin', 'customer'),
  phone: String,
  bio: String,
  avatar: String,
  darkMode: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  images: [String],
  stock: Number,
  isFeatured: Boolean,
  isSale: Boolean,
  salePrice: Number,
  createdAt: Date
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  products: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  shippingFee: Number,
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  status: String (enum: pending, processing, shipped, delivered, cancelled, return_requested, returned),
  isPaid: Boolean,
  paidAt: Date,
  createdAt: Date
}
```

---

## 🔐 Security Features

1. **Password Hashing** - All passwords hashed with bcryptjs
2. **JWT Authentication** - Token-based session management
3. **Role-Based Access** - Admin and customer roles
4. **Email Token Expiry** - Password reset tokens expire after 1 hour
5. **Input Validation** - Request body validation

---

## 📧 Email System

The backend includes a complete email system using Nodemailer:

- **Password Reset** - Users receive secure reset links via email
- **Welcome Emails** - New users get a welcome message
- **Development Mode** - Emails are logged to console if not configured

See [`EMAIL_SETUP.md`](EMAIL_SETUP.md) for detailed configuration instructions.

---

## 🧪 Testing with Postman

1. Import the collection or manually add requests
2. Register a new user
3. Login to get the JWT token
4. Use the token in Authorization header:
   ```
   Authorization: Bearer <your_token>
   ```

---

## 🔧 Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### JWT Error
- Make sure `JWT_SECRET` is set in `.env`
- Check token expiration

### Email Not Sending
- Verify credentials in `.env`
- For Gmail, use App Password not regular password
- Check [`EMAIL_SETUP.md`](EMAIL_SETUP.md) for troubleshooting

---

## 📝 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| dev | `npm run dev` | Start with nodemon (auto-reload) |
| start | `npm start` | Start production server |
| seed | `node seed-all-categories.js` | Seed database with initial data |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available for learning and development purposes.

---

## 📚 Related Documentation

- [Frontend README](../README.md)
- [Email Setup Guide](EMAIL_SETUP.md)
- [Backend Blueprint](../plans/backend-blueprint.md)
