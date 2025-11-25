# Final Project — Grocery List API

A **Node.js + Express + Prisma** backend API for managing grocery lists, categories, items, and users with full authentication, authorization, and OpenAPI documentation.

This project supports:

* User registration & login (JWT)
* Role-based access (USER vs ADMIN)
* Lists, items, categories CRUD
* User profile update & deletion
* Change password + Admin reset password
* Full Swagger / OpenAPI documentation bundled with Redocly

---

## Getting Started

### **1. Clone the repository**

```bash
git clone <repo_url>
cd final-project-library-api
```

---

## Install Dependencies

### **Install all project dependencies:**

```bash
npm install
```

### **Install Swagger UI & YAML loader**

```bash
npm install swagger-ui-express yamljs
```

### **Install Redocly CLI (bundler for OpenAPI)**

```bash
npm install -D @redocly/cli
```

---

## Database Setup (Prisma + SQLite/MySQL/Postgres)

### **Seed the database**

This will clear existing data and insert:

* 1 Admin user
* 1 Regular user
* Predefined categories & items
* Sample lists with list items

```bash
npm run seed
```

---

## Generate OpenAPI Documentation Bundle

Your API docs are located under `docs/openapi.yaml`.

To bundle them for Swagger UI:

```bash
npx @redocly/cli bundle docs/openapi.yaml -o public/bundled.yaml
```

This compiles all split `.yaml` files into one bundle used by Swagger.

---

## Apply Prisma Migrations

After updating `schema.prisma` (if needed):

```bash
npx prisma migrate dev
```

This regenerates the database tables.

---

## Run the Development Server

Start the API:

```bash
npm run dev
```

Your API will run at:

```
http://localhost:3000
```

---

## API Documentation (Swagger UI)

After bundling OpenAPI:

Open in your browser:

```
http://localhost:3000/api-docs
```

You will see all endpoints grouped by:

* Authentication
* Users
* Lists
* Items
* Categories
* System

---

## Admin & User Credentials (from seed)

### **Admin**

```
email: admin@example.com
password: AdminPass123!
```

### **User**

```
email: john@example.com
password: UserPass123!
```

Use these accounts to test role-based endpoints.

---

## Project Structure

```
├── docs/                 # OpenAPI (split YAML files)
├── public/bundled.yaml   # Generated API documentation
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding script
├── src/
│   ├── config/            # DB config
│   ├── controllers/       # Route logic
│   ├── middleware/        # JWT authentication
│   ├── repositories/      # Prisma DB queries
│   ├── routes/            # Express route files
│   └── services/          # Business logic
├── package.json
└── README.md
```

---

## Testing Notes

Use **Postman**, **Thunder Client**, or **Swagger UI** to test:

* Login → get token
* Set `Authorization: Bearer <token>`
* Test CRUD operations and role/ownership restrictions





