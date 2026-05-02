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

---

## 5. User Profile & Settings (Authenticated)

### Update Profile
*Update user personal details like name, phone, and avatar.*
```bash
curl -X PATCH http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "name": "Jane Doe",
    "phone": "08012345678",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

### Change Password
*Update account password.*
```bash
curl -X PATCH http://localhost:5000/api/users/security/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }'
```

### Toggle Two-Factor Authentication (2FA)
*Enable or disable 2FA for the user account.*
```bash
curl -X PATCH http://localhost:5000/api/users/security/2fa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "enabled": true
  }'
```

### Update Preferences
*Update user theme and notification preferences.*
```bash
curl -X PATCH http://localhost:5000/api/users/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "theme": "dark",
    "notifEmail": true,
    "notifSms": false,
    "notifPush": true
  }'
```

---

## 6. Fleet Management (Admin Only)

### Get Fleet Overview & List
*Returns fleet statistics (Total, Available, Maintenance) and the full list of buses.*
```bash
curl -X GET http://localhost:5000/api/fleet \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Register New Bus Asset (Multipart/FormData)
*Note: This request uses `multipart/form-data` to handle file streams for certificates and photos.*
```bash
curl -X POST http://localhost:5000/api/fleet \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -F "registrationNumber=BUS-003" \
  -F "nickname=Express King" \
  -F "manufacturer=Mercedes" \
  -F "model=Travego" \
  -F "year=2023" \
  -F "totalCapacity=50" \
  -F "availableSeats=50" \
  -F "transmissionType=Automatic" \
  -F "maintenanceStatus=Excellent" \
  -F "amenities=[\"WiFi\", \"Air Conditioning\"]" \
  -F "vehicleRegistrationCert=@/path/to/reg_cert.pdf" \
  -F "busPhotos=@/path/to/bus_front.jpg" \
  -F "busPhotos=@/path/to/bus_side.jpg"
```

### Get Weekly Fleet Performance
*Returns revenue, trip counts, and daily utilization trends.*
```bash
curl -X GET http://localhost:5000/api/fleet/performance \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Download Protected Document
*Serves a bus document only if a valid Admin token is provided.*
```bash
curl -X GET http://localhost:5000/api/fleet/documents/sample_cert.pdf \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  --output downloaded_cert.pdf
```
