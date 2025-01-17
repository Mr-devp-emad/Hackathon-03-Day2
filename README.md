

---

# Bandage Online Shopping Platform

**Author**: Emad Ahmed  
**Target**: , Emad`s Online Shopping Store  

---

## Overview
This document outlines the **technical foundation** and **enhanced workflow** for the ** Emad`s Online Shopping Store Platform**. It includes system architecture, key workflows, API endpoints, and a technical roadmap.

---

## System Architecture

### High-Level Diagram
[Frontend (Next.js)]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v  
[Sanity CMS] <--------> [Product Data (Mock) API]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ^  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| |  
[Third-Party APIs] <----> [(ShipEngine) Shipment Tracking API]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| |  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| v  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| [Payment Gateway (Stripe)]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v  
[Authentication (Clerk)]  

---

### Component Descriptions
- **Frontend (Next.js)**:
  - Provides a responsive and interactive user interface for browsing products, managing orders, and handling user authentication.
  - Fetches and displays data dynamically using APIs in real-time.

- **Sanity CMS**:
  - Centralized backend for managing product information, user data, order records, and inventory.
  - Exposes APIs for dynamic data communication with the frontend.

- **Third-Party APIs**:
  1. **Shipment Tracking API (ShipEngine)**: Fetches real-time shipping updates and generates tracking details for orders.
  2. **Payment Gateway (Stripe)**: Processes secure payments and confirms payment status.

- **Authentication (Clerk)**:
  - Handles user registration, login, and session management.
  - Integrates with Sanity CMS to securely store and retrieve user data.

---

## Key Workflows

### 1. **User Registration**
- **Process**:
  - User signs up via the frontend using Clerk.
  - Registration details are stored in Sanity CMS for further use.

### 2. **Product Browsing**
- **Process**:
  - User navigates through product categories on the frontend.
  - Sanity CMS API fetches product data (name, price, stock, description, images).
  - Dynamic product listings are displayed on the frontend.

### 3. **Order Placement**
- **Process**:
  - User adds products to the cart and proceeds to checkout.
  - Order details (products, quantities, shipping address) are sent to Sanity CMS.
  - Payment is processed via Stripe.
  - A confirmation message is sent to the user's email, and the order is recorded in Sanity CMS.

### 4. **Shipment Tracking**
- **Process**:
  - After order placement, shipment details are updated using ShipEngine.
  - Real-time tracking information is displayed to the user on the frontend.

### 5. **Inventory Management**
- **Process**:
  - Product stock levels are managed in Sanity CMS.
  - Real-time stock updates are fetched from Sanity CMS.
  - Out-of-stock products are added to the wishlist instead of the cart.
  - In-stock products can be added to the cart and proceed to checkout.

---

## API Endpoints

| **Endpoint**           | **Method** | **Purpose**                        | **Response Example**                                                        |
|------------------------|------------|------------------------------------|-----------------------------------------------------------------------------|
| `/products`            | GET        | Fetch all product details          | `[ { "name": "Product Name", "slug": "product-slug", "price": 100 } ]`     |
| `/order`               | POST       | Submit new order details           | `{ "orderId": 123, "status": "success" }`                                  |
| `/shipment-tracking`   | GET        | Fetch real-time tracking updates   | `{ "trackingId": "AB123", "status": "In Transit" }`                        |
| `/delivery-status`     | GET        | Fetch express delivery information | `{ "orderId": 456, "deliveryTime": "30 mins" }`                            |
| `/inventory`           | GET        | Fetch real-time stock levels       | `{ "productId": 789, "stock": 50 }`                                        |
| `/cart`                | POST       | Add product to cart                | `{ "cartId": 101, "items": [...] }`                                        |
| `/wishlist`            | POST       | Add product to wishlist            | `{ "wishlistId": 202, "items": [...] }`                                    |

---

## Sanity Schema Example

Below is an example schema for products in Sanity CMS:

```javascript
import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productTypes = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discountPrice",
      title: "Discount Price",
      type: "number",
      validation: (Rule) =>
        Rule.custom((discountPrice, context) => {
          const doc = context.document;
          if (discountPrice && discountPrice >= doc.price) {
            return "Discount price must be less than the original price";
          }
          return true;
        }),
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "name", media: "image", subtitle: "price" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: `$${subtitle}`,
        media,
      };
    },
  },
});
```

---

## Technical Roadmap

### Development Phase
- Implement **Clerk** for user authentication and integrate it with Sanity CMS.
- Develop mock APIs for product, order, and cart management.
- Implement **Stripe** for payment processing.

### Testing Phase
- Conduct end-to-end testing for all workflows (e.g., user registration, product browsing, checkout).
- Validate APIs using **Postman** or similar tools.

### Launch Phase
- Deploy the platform using **Vercel** or **Netlify** for scalability.
- Monitor performance using tools like **Sentry** or **New Relic**.
- Enable post-launch updates based on user feedback.

---

## Conclusion
The **Bandage Online Shopping Platform** aims to deliver a seamless shopping experience with robust functionality like real-time shipment tracking, secure payment processing, and user-friendly interfaces. This document provides a strong technical foundation for successful development and deployment.

---
