# E-commerce Application

A modern e-commerce web application built with Express.js, Redis, and Bootstrap, featuring product browsing and shopping cart functionality.

## Features

- Product listing with search and filtering
- Redis-powered caching system for improved performance
- Shopping cart functionality with session management
- Responsive design using Bootstrap and Tailwind CSS
- RESTful API endpoints for product and cart management

## Prerequisites

- Node.js (v14 or higher)
- Redis server
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
npm install
```

3. Start Redis server:

```bash
redis-server
```

4. Start the application:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── public/
│   ├── css/
│   │   └── style.css
│   └── index.html
├── routes/
│   └── products.js
├── app.js
└── README.md
```

## API Endpoints

### Products

- `GET /products` - Get all products
  - Query parameters:
    - `limit`: Number of products to return
- `GET /products/:id` - Get a specific product
- `GET /products/cart` - Get cart contents
- `POST /products/cart` - Add product to cart
- `DELETE /products/cart/:productId` - Remove product from cart

## Technologies Used

- **Backend**

  - Express.js
  - Redis (for caching and session management)
  - express-session
  - connect-redis


- **Frontend**
  - Bootstrap 5 (Simplex theme)
  - Tailwind CSS
  - Vanilla JavaScript

## Caching System

The application implements a Redis-based caching system that:

- Caches product data for 10 seconds
- Reduces load on the external API
- Provides faster response times for frequently accessed data

## Session Management

Cart data is managed using Redis-based sessions with the following features:

- Secure session storage
- Cart persistence across page refreshes
- Session expiration handling

## Error Handling

The application includes comprehensive error handling for:

- Redis connection issues
- API request failures
- Invalid cart operations
- Missing or malformed data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


