# SalonOS — System Architecture

## Product Overview
SalonOS is a multi-tenant SaaS customer management platform targeting 
small businesses in the Saudi market. The platform supports Arabic (RTL) 
and English (LTR) languages.

## Target Market
- Country: Saudi Arabia 🇸🇦
- Primary users: Salons
- Languages: Arabic & English (i18n)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js |
| Database | PostgreSQL |
| Auth | Supabase |
| Hosting | Vercel |
| Payments | Mada, Apple Pay, Card |

## Multi-Tenancy Architecture
Each business that signs up is a **tenant** — they have their own 
completely isolated data.

How it works:
- Every table has a `tenant_id` field
- When a user logs in, the system identifies their tenant
- Every database query automatically filters by `tenant_id`
- One tenant can never see another tenant's data, even accidentally

Example:
- Salon A owner logs in → sees ONLY Salon A's customers
- Salon B owner logs in → sees ONLY Salon B's customers
- Same database, completely isolated data

## User Roles (RBAC)
Role Based Access Control — each user has a role that defines 
exactly what they can see and do.

| Permission | Owner | Receptionist | Stylist |
|-----------|-------|-------------|---------|
| View reports & revenue | ✅ | ❌ | ❌ |
| Manage staff | ✅ | ❌ | ❌ |
| Manage services & prices | ✅ | ❌ | ❌ |
| View all appointments | ✅ | ✅ | ❌ |
| Manage appointments | ✅ | ✅ | ❌ |
| View own appointments | ✅ | ✅ | ✅ |
| Manage customers | ✅ | ✅ | ❌ |
| View payments | ✅ | ❌ | ❌ |

## Subscription Plans
Three tiers: **Basic**, **Pro**, **Enterprise**
Each tier unlocks more features, staff accounts, and capacity.
A 14-day free trial is available on all plans.

## Database Schema

### tenants
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary Key |
| name_en | VARCHAR | Salon name in English |
| name_ar | VARCHAR | Salon name in Arabic |
| owner_name | VARCHAR | |
| email | VARCHAR | Unique |
| phone | VARCHAR | |
| city | VARCHAR | Saudi city |
| subscription_plan | ENUM | basic / pro / enterprise |
| created_at | TIMESTAMP | |

### users
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary Key |
| tenant_id | UUID | FK → tenants |
| name | VARCHAR | |
| email | VARCHAR | Unique per tenant |
| password_hash | VARCHAR | Never store plain passwords |
| role | ENUM | owner / receptionist / stylist |
| created_at | TIMESTAMP | |

### customers
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary Key |
| tenant_id | UUID | FK → tenants |
| name_en | VARCHAR | |
| name_ar | VARCHAR | Optional |
| phone | VARCHAR | |
| email | VARCHAR | Optional |
| notes | TEXT | VIP notes, preferences |
| created_at | TIMESTAMP | |

### services
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary Key |
| tenant_id | UUID | FK → tenants |
| name_en | VARCHAR | |
| name_ar | VARCHAR | |
| duration_minutes | INTEGER | |
| price | DECIMAL | In SAR |
| created_at | TIMESTAMP | |

### appointments
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary Key |
| tenant_id | UUID | FK → tenants |
| customer_id | UUID | FK → customers |
| service_id | UUID | FK → services |
| assigned_to | UUID | FK → users (stylist) |
| date | DATE | |
| time | TIME | |
| status | ENUM | scheduled / completed / cancelled |
| notes | TEXT | Optional |
| created_at | TIMESTAMP | |

### payments
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary Key |
| appointment_id | UUID | FK → appointments |
| amount | DECIMAL | In SAR |
| method | ENUM | cash / card / mada / apple_pay |
| status | ENUM | paid / pending / refunded |
| created_at | TIMESTAMP | |

## Internationalization (i18n)
- UI language: Arabic & English
- Arabic = RTL (right to left) layout
- English = LTR (left to right) layout
- Bilingual fields stored as: name_en / name_ar

## Data Management & Deletion Policy

### Soft Delete Pattern
All deletions use soft delete — data is never immediately removed.
- `deleted_at` timestamp marks when deletion was requested
- `is_active = false` hides the record from the application
- Hard delete only happens after 30-day grace period

### Tenant Deletion Flow
1. Export data offered (customers, appointments, payments)
2. Account suspended immediately
3. 30-day grace period for recovery
4. Permanent deletion after 30 days

### Who Can Delete
- **SaaS Admin (us):** Can suspend/delete any tenant (abuse, non-payment)
- **Tenant Owner:** Can delete their own account only
- **Staff:** Cannot delete the account