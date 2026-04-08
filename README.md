# InvenTracker Pro - Full-Stack Inventory System

A production-quality inventory management system with a search-focused UI and a database-backed backend.

## 🚀 Features
- **Part A: Inventory Search**
  - Partial, case-insensitive product name search.
  - Exact category matching.
  - Price range filtering (min/max).
  - Real-time/Button-triggered live filtering with premium UI.
- **Part B: Database Management**
  - Persistent SQLite storage for Suppliers and Inventory.
  - API for creating Suppliers and Inventory items.
  - Advanced Grouping Query: Inventory grouped by supplier, sorted by total inventory value (`SUM(quantity * price)`).

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, SQLite3 (with `sqlite` wrapper for async/await).
- **Frontend:** React (Vite), Axios, Lucide-React, Vanilla CSS.
- **Design:** Modern, dark-themed, glassmorphic UI with responsive layout.

## 📂 Project Structure
- `backend/`: Node.js server, controllers, routes, and DB config.
- `frontend/`: React application, premium CSS, and API services.

## 1. Search Logic
The `/api/search` endpoint uses a dynamic SQL query builder. It starts with a base query `SELECT * FROM inventory WHERE 1=1` and appends filters based on the presence of query parameters:
- `q`: Uses `LIKE %text%` for partial match.
- `category`: Uses exact match `=`.
- `minPrice / maxPrice`: Uses comparison operators `>=` and `<=`.
The filters are combined using `AND` logic, allowing for highly specific searches.

## 2. Database Schema
### Suppliers Table
- `id`: INTEGER (Primary Key)
- `name`: TEXT
- `city`: TEXT

### Inventory Table
- `id`: INTEGER (Primary Key)
- `supplier_id`: INTEGER (Foreign Key -> Suppliers.id)
- `product_name`: TEXT
- `quantity`: INTEGER (Must be ≥ 0)
- `price`: REAL (Must be > 0)
- `category`: TEXT

## 3. Tech Choice: SQLite
**SQLite** was chosen for this project because:
- **Zero Configuration:** It is a file-based database that requires no external server setup, making it ideal for portable projects and assignments.
- **ACID Compliant:** Ensures reliability and data integrity.
- **Lightweight & Fast:** Perfect for small-to-medium inventory systems.
- **Production-Ready:** While lightweight, it is highly capable and used in millions of applications globally.

## 4. Performance Improvement
**Indexing:** To optimize search operations, we can add an index on the `product_name` and `category` columns.
```sql
CREATE INDEX idx_product_name ON inventory(product_name);
CREATE INDEX idx_category ON inventory(category);
```
**Why?** Without an index, the database must perform a full table scan for every search. An index allows the database to find matching records in `O(log n)` time instead of `O(n)`, significantly improving performance as the inventory grows.

## 🖥️ How to Run

I have simplified the setup process so you can start everything with a single command.

### 1. Initial Setup (One-time)
From the root directory, run:
```bash
npm run install-all
```

### 2. Start Project
From the root directory, run:
```bash
npm start
```
This will start both the **Backend** and **Frontend** simultaneously. 
- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:5000

---
Built with ❤️ by Antigravity
