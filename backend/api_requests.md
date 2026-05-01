# API Testing Guide (Sample Requests)

Yes, the backend logic is complete for Admin, Ticketer, and Passenger roles. 

To test these endpoints, make sure you have your database running, and you've started the server using `npm run dev`.

Here are standard `curl` commands you can copy and paste into your terminal. They cover the main workflows.

> [!TIP]
> **Authentication Token**: Many of these routes are private. After you run the login or register requests, you will receive a `"token": "ey..."` in the response. Replace `<YOUR_JWT_TOKEN>` in the commands below with that actual token string.

## 1. Authentication

### Register an Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@example.com",
    "password": "password123",
    "role": "Admin"
  }'
```

### Register a Ticketer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Station Ticketer",
    "email": "ticketer@example.com",
    "password": "password123",
    "role": "Ticketer"
  }'
```

### Login (Works for all roles)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

---

## 2. Trips Management (Admin & General)

### Create a Trip (Requires Admin Token)
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "departureDate": "2026-05-01T00:00:00Z",
    "departureTime": "08:00 AM",
    "departureTerminal": "Lagos HQ",
    "arrivalTerminal": "Abuja Central",
    "availableSeats": 50,
    "price": 15000
  }'
```

### Get All Trips (Public - Supports Pagination and Search)
```bash
# Basic request
curl -X GET http://localhost:5000/api/trips

# With Search Filters (e.g., from Lagos to Abuja, needs 2 seats)
curl -X GET "http://localhost:5000/api/trips?from=Lagos&to=Abuja&passengers=2&page=1&limit=5"
```

---

## 3. Bookings (Passenger, Ticketer, Admin)

### Create a Booking (Requires User Token - Passenger or Admin)
*Note: Replace `<TRIP_ID>` with an ID returned from the "Get All Trips" response.*
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "tripId": "<TRIP_ID>",
    "seats": 2,
    "passengers": [
      {
        "fullName": "John Doe",
        "seatNumber": "12",
        "phone": "08012345678"
      },
      {
        "fullName": "Jane Doe",
        "seatNumber": "13",
        "phone": "08087654321"
      }
    ],
    "totalPrice": 30000,
    "extraBaggage": 1
  }'
```

### Get Bookings
*If an Admin or Ticketer calls this, they get all system bookings. If a Passenger calls this, they only get their own.*
```bash
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Update Booking Status (Requires Ticketer or Admin Token)
*Use this to mark a booking as 'confirmed' or 'cancelled'.*
*Note: Replace `<BOOKING_ID>` with an ID returned from "Get Bookings".*
```bash
curl -X PATCH http://localhost:5000/api/bookings/<BOOKING_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "status": "confirmed"
  }'
```

---

## 4. System Settings (Admin & General)

### Get System Settings (Public / Authenticated)
*Returns global configuration like extra baggage pricing.*
```bash
curl -X GET http://localhost:5000/api/settings
```

### Update System Settings (Requires Admin Token)
```bash
curl -X PUT http://localhost:5000/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "extraBaggagePrice": 2500
  }'
```
