# 🚀 Backend Architecture Refactoring Report

## 1. Overview

The backend architecture has been successfully migrated from a legacy **Layered Architecture** (where all controllers are in one folder, all services in another) to a modern **Modular Monolith (Module-based) Architecture**.

This refactoring strictly focused on internal structure and code organization. **No business logic or API endpoints were changed**. The frontend remains 100% compatible.

## 2. Structural Changes

### 2.1. Shared Kernel (`src/shared/`)

We extracted common, cross-cutting concerns into a `shared/` directory. These are components that don't belong to any specific domain module but are used globally.

- **`models/`**: Contains all Mongoose models (`User`, `Company`, `RescueRequest`, etc.). Models act as the single source of truth for the database schema.
- **`middleware/`**: `auth.middleware`, `error.middleware`, `authorize.middleware`.
- **`utils/`**: Helper functions (`jwt`, `upload`, `apiError`).
- **`config/`**: Database connection (`db.ts`).
- **`constants/`**: Global constants.

### 2.2. Domain Modules (`src/modules/`)

Features were grouped by business domain into self-contained modules. Each module encapsulates its own Controller, Service, Repository, Validator, and Routes.

| Module                | Purpose                         | Key Components                                                                                                  |
| --------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **`auth`**            | Authentication and registration | User/Company login, JWT generation, Role verification                                                           |
| **`company`**         | Company profiles                | Fetching company details, searching nearby companies                                                            |
| **`rescue`**          | Core business logic             | Merged company and customer perspectives for rescue requests. Handles status lifecycle, tracking, and payments. |
| **`vehicle`**         | Fleet management                | Managing tow trucks and rescue vehicles for companies                                                           |
| **`service-catalog`** | Services offered                | Managing rescue service catalogs (e.g., jump start, towing)                                                     |
| **`message`**         | Chat system                     | Real-time chat history between users and companies                                                              |

### 2.3. Interface-Driven Communication

To prevent tight coupling ("spaghetti code"), modules no longer import internal Services or Repositories directly from other modules.

Instead, every module defines explicit **Interface Contracts** (e.g., `ICompanyService`, `IRescueCompanyService`) in its `interfaces/` folder.
When `module A` needs something from `module B`, it relies on the defined interface, making the system highly testable and loosely coupled.

### 2.4. Centralized Routing

A new file `src/routes.ts` was introduced to act as the single entry point for all API routes. This file simply mounts the routes exposed by each module, keeping `app.ts` clean.

## 3. Benefits of the New Design

- **High Cohesion**: Everything related to a specific feature (e.g., `vehicle`) is in one place.
- **Loose Coupling**: Modules interact through well-defined interfaces.
- **Scalability**: New features can be added as isolated modules without touching existing code.
- **Maintainability**: The transition sets a solid foundation for future microservices extraction if needed.

## 4. Migration Summary

- Successfully eliminated circular dependencies.
- Re-routed all internal imports to point to `shared/` or correct module namespaces.
- Type definitions were strengthened and validated using `tsc --noEmit`.
- Deleted all obsolete legacy folders (`controllers/`, `services/`, `repositories/`, `routes/`, `validators/`, `models/`, `middleware/`, `utils/`).
