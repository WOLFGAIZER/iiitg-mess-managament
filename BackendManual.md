## Backend User Manual - Mess Management System

### Base URL
- **Base URL**: `http://localhost:5000/api`

### Authentication
- All endpoints (except `/users/register` and `/users/login`) require an `Authorization` header with a JWT token obtained from login.
- Header format: `Authorization: <token>` (replace `<token>` with the JWT from login).

### Tools Required
- **Postman**: For testing API requests.
- **MongoDB**: Ensure the backend is connected to a MongoDB instance (via `MONGO_URI` in `.env`).

---

## Endpoints Overview

### 1. User Management
- Register, login, profile management, and admin user CRUD.

### 2. Token Management
- Buy tokens, view tokens, generate QR codes, and use tokens (admin only).

### 3. Food & Menu Management
- View menu, add/update/delete food (admin), view/add meals (admin).

### 4. Complaint Management
- Register/view complaints (user), view/update all complaints (admin).

### 5. Voting Management
- Cast votes, view user votes, view election results, create elections (admin).

---

## API Endpoints

### 1. User Management

#### Register (Public)
- **Method**: `POST`
- **URL**: `/users/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "<jwt-token>"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/users/register`.
  3. Go to "Body" tab, select "raw" and "JSON".
  4. Paste the body JSON.
  5. Click "Send".
  6. Copy the `token` from the response for future requests.

#### Login (Public)
- **Method**: `POST`
- **URL**: `/users/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "<jwt-token>"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/users/login`.
  3. Add body as JSON.
  4. Send request and save the `token`.

#### Get Profile (User)
- **Method**: `GET`
- **URL**: `/users/profile`
- **Headers**: `Authorization: <token>`
- **Response**:
  ```json
  {
    "_id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profileDetails": { "phone": "", "address": "" },
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/users/profile`.
  3. Add `Authorization` header with token.
  4. Send request.

#### Update Profile (User)
- **Method**: `PUT`
- **URL**: `/users/profile`
- **Headers**: `Authorization: <token>`
- **Body**:
  ```json
  {
    "phone": "1234567890",
    "address": "123 Main St"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profileDetails": { "phone": "1234567890", "address": "123 Main St" },
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `PUT`.
  2. Enter URL: `http://localhost:5000/api/users/profile`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

#### Get All Users (Admin)
- **Method**: `GET`
- **URL**: `/users/all`
- **Headers**: `Authorization: <admin-token>`
- **Response**:
  ```json
  [
    {
      "_id": "12345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "profileDetails": { "phone": "1234567890", "address": "123 Main St" },
      "createdAt": "2025-04-01T00:00:00.000Z"
    }
  ]
  ```
- **Postman Steps**:
  1. Register/login as an admin (set `"role": "admin"` in DB manually if needed).
  2. Set method to `GET`.
  3. Enter URL: `http://localhost:5000/api/users/all`.
  4. Add `Authorization` header with admin token.
  5. Send request.

#### Delete User (Admin)
- **Method**: `DELETE`
- **URL**: `/users/:id`
- **Headers**: `Authorization: <admin-token>`
- **Example URL**: `/users/12345`
- **Response**:
  ```json
  { "msg": "User deleted" }
  ```
- **Postman Steps**:
  1. Set method to `DELETE`.
  2. Enter URL: `http://localhost:5000/api/users/12345` (replace `12345` with a user ID).
  3. Add `Authorization` header with admin token.
  4. Send request.

---

### 2. Token Management

#### Buy Tokens (User)
- **Method**: `POST`
- **URL**: `/tokens/buy`
- **Headers**: `Authorization: <token>`
- **Body**:
  ```json
  { "amount": 100 }
  ```
- **Response**:
  ```json
  {
    "_id": "67890",
    "userId": "12345",
    "amount": 100,
    "status": "active",
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/tokens/buy`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

#### Get User Tokens (User)
- **Method**: `GET`
- **URL**: `/tokens`
- **Headers**: `Authorization: <token>`
- **Response**:
  ```json
  [
    {
      "_id": "67890",
      "userId": "12345",
      "amount": 100,
      "status": "active",
      "createdAt": "2025-04-01T00:00:00.000Z"
    }
  ]
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/tokens`.
  3. Add `Authorization` header.
  4. Send request.

#### Generate QR Code (User)
- **Method**: `POST`
- **URL**: `/tokens/qr`
- **Headers**: `Authorization: <token>`
- **Body**:
  ```json
  { "tokenId": "67890" }
  ```
- **Response**:
  ```json
  {
    "_id": "abcde",
    "userId": "12345",
    "tokenId": "67890",
    "qrCode": "qr_1234567890",
    "expiry": "2025-04-02T00:00:00.000Z",
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/tokens/qr`.
  3. Add `Authorization` header.
  4. Add body as JSON with a valid `tokenId`.
  5. Send request.

#### Use Token (Admin)
- **Method**: `PUT`
- **URL**: `/tokens/use/:id`
- **Headers**: `Authorization: <admin-token>`
- **Example URL**: `/tokens/use/67890`
- **Response**:
  ```json
  { "msg": "Token used" }
  ```
- **Postman Steps**:
  1. Set method to `PUT`.
  2. Enter URL: `http://localhost:5000/api/tokens/use/67890` (replace `67890` with a token ID).
  3. Add `Authorization` header with admin token.
  4. Send request.

---

### 3. Food & Menu Management

#### Get Menu (Public)
- **Method**: `GET`
- **URL**: `/food/menu`
- **Response**:
  ```json
  [
    {
      "_id": "food1",
      "name": "Rice",
      "category": "Main",
      "price": 50,
      "availability": true,
      "createdAt": "2025-04-01T00:00:00.000Z"
    }
  ]
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/food/menu`.
  3. Send request (no token needed).

#### Add Food (Admin)
- **Method**: `POST`
- **URL**: `/food`
- **Headers**: `Authorization: <admin-token>`
- **Body**:
  ```json
  {
    "name": "Dal",
    "category": "Main",
    "price": 40,
    "availability": true
  }
  ```
- **Response**:
  ```json
  {
    "_id": "food2",
    "name": "Dal",
    "category": "Main",
    "price": 40,
    "availability": true,
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/food`.
  3. Add `Authorization` header with admin token.
  4. Add body as JSON.
  5. Send request.

#### Update Food (Admin)
- **Method**: `PUT`
- **URL**: `/food/:id`
- **Headers**: `Authorization: <admin-token>`
- **Example URL**: `/food/food2`
- **Body**:
  ```json
  { "price": 45 }
  ```
- **Response**:
  ```json
  {
    "_id": "food2",
    "name": "Dal",
    "category": "Main",
    "price": 45,
    "availability": true,
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `PUT`.
  2. Enter URL: `http://localhost:5000/api/food/food2`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

#### Delete Food (Admin)
- **Method**: `DELETE`
- **URL**: `/food/:id`
- **Headers**: `Authorization: <admin-token>`
- **Example URL**: `/food/food2`
- **Response**:
  ```json
  { "msg": "Food deleted" }
  ```
- **Postman Steps**:
  1. Set method to `DELETE`.
  2. Enter URL: `http://localhost:5000/api/food/food2`.
  3. Add `Authorization` header.
  4. Send request.

#### Get Meals by Date (User/Admin)
- **Method**: `GET`
- **URL**: `/food/meals?date=<YYYY-MM-DD>`
- **Headers**: `Authorization: <token>`
- **Example URL**: `/food/meals?date=2025-04-01`
- **Response**:
  ```json
  [
    {
      "_id": "meal1",
      "date": "2025-04-01T00:00:00.000Z",
      "type": "lunch",
      "foodItems": [{ "_id": "food1", "name": "Rice", "category": "Main", "price": 50 }],
      "createdAt": "2025-04-01T00:00:00.000Z"
    }
  ]
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/food/meals?date=2025-04-01`.
  3. Add `Authorization` header.
  4. Send request.

#### Add Meal (Admin)
- **Method**: `POST`
- **URL**: `/food/meals`
- **Headers**: `Authorization: <admin-token>`
- **Body**:
  ```json
  {
    "date": "2025-04-01",
    "type": "lunch",
    "foodItems": ["food1"]
  }
  ```
- **Response**:
  ```json
  {
    "_id": "meal1",
    "date": "2025-04-01T00:00:00.000Z",
    "type": "lunch",
    "foodItems": ["food1"],
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/food/meals`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

---

### 4. Complaint Management

#### Register Complaint (User)
- **Method**: `POST`
- **URL**: `/complaints`
- **Headers**: `Authorization: <token>`
- **Body**:
  ```json
  {
    "title": "Bad Food",
    "description": "The rice was undercooked."
  }
  ```
- **Response**:
  ```json
  {
    "_id": "comp1",
    "userId": "12345",
    "title": "Bad Food",
    "description": "The rice was undercooked.",
    "status": "pending",
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/complaints`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

#### Get User Complaints (User)
- **Method**: `GET`
- **URL**: `/complaints`
- **Headers**: `Authorization: <token>`
- **Response**:
  ```json
  [
    {
      "_id": "comp1",
      "userId": "12345",
      "title": "Bad Food",
      "description": "The rice was undercooked.",
      "status": "pending",
      "createdAt": "2025-04-01T00:00:00.000Z"
    }
  ]
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/complaints`.
  3. Add `Authorization` header.
  4. Send request.

#### Get All Complaints (Admin)
- **Method**: `GET`
- **URL**: `/complaints/all`
- **Headers**: `Authorization: <admin-token>`
- **Response**:
  ```json
  [
    {
      "_id": "comp1",
      "userId": "12345",
      "title": "Bad Food",
      "description": "The rice was undercooked.",
      "status": "pending",
      "createdAt": "2025-04-01T00:00:00.000Z"
    }
  ]
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/complaints/all`.
  3. Add `Authorization` header with admin token.
  4. Send request.

#### Update Complaint Status (Admin)
- **Method**: `PUT`
- **URL**: `/complaints/:id`
- **Headers**: `Authorization: <admin-token>`
- **Example URL**: `/complaints/comp1`
- **Body**:
  ```json
  { "status": "resolved" }
  ```
- **Response**:
  ```json
  {
    "_id": "comp1",
    "userId": "12345",
    "title": "Bad Food",
    "description": "The rice was undercooked.",
    "status": "resolved",
    "createdAt": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `PUT`.
  2. Enter URL: `http://localhost:5000/api/complaints/comp1`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

---

### 5. Voting Management

#### Cast Vote (User)
- **Method**: `POST`
- **URL**: `/voting`
- **Headers**: `Authorization: <token>`
- **Body**:
  ```json
  {
    "electionId": "elec1",
    "candidate": "Candidate A"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "vote1",
    "userId": "12345",
    "electionId": "elec1",
    "candidate": "Candidate A",
    "voteDate": "2025-04-01T00:00:00.000Z"
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/voting`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

#### Get User Votes (User)
- **Method**: `GET`
- **URL**: `/voting`
- **Headers**: `Authorization: <token>`
- **Response**:
  ```json
  [
    {
      "_id": "vote1",
      "userId": "12345",
      "electionId": "elec1",
      "candidate": "Candidate A",
      "voteDate": "2025-04-01T00:00:00.000Z"
    }
  ]
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/voting`.
  3. Add `Authorization` header.
  4. Send request.

#### Get Election Results (Admin)
- **Method**: `GET`
- **URL**: `/voting/results/:electionId`
- **Headers**: `Authorization: <admin-token>`
- **Example URL**: `/voting/results/elec1`
- **Response**:
  ```json
  [
    { "_id": "Candidate A", "count": 1 }
  ]
  ```
- **Postman Steps**:
  1. Set method to `GET`.
  2. Enter URL: `http://localhost:5000/api/voting/results/elec1`.
  3. Add `Authorization` header with admin token.
  4. Send request.

#### Create Election (Admin)
- **Method**: `POST`
- **URL**: `/voting/election`
- **Headers**: `Authorization: <admin-token>`
- **Body**:
  ```json
  {
    "electionId": "elec1",
    "candidates": ["Candidate A", "Candidate B"]
  }
  ```
- **Response**:
  ```json
  {
    "electionId": "elec1",
    "candidates": ["Candidate A", "Candidate B"]
  }
  ```
- **Postman Steps**:
  1. Set method to `POST`.
  2. Enter URL: `http://localhost:5000/api/voting/election`.
  3. Add `Authorization` header.
  4. Add body as JSON.
  5. Send request.

---

## Testing Workflow in Postman

1. **Setup Admin User**:
   - Register a user: `POST /users/register` with `{"name": "Admin", "email": "admin@example.com", "password": "admin123"}`.
   - Manually set `role: "admin"` in MongoDB (e.g., via MongoDB Compass).
   - Login: `POST /users/login` to get admin token.

2. **User Flow**:
   - Register: `POST /users/register`.
   - Login: `POST /users/login`.
   - Update Profile: `PUT /users/profile`.
   - Buy Tokens: `POST /tokens/buy`.
   - Get Tokens: `GET /tokens`.
   - Generate QR: `POST /tokens/qr`.
   - View Menu: `GET /food/menu`.
   - View Meals: `GET /food/meals?date=2025-04-01`.
   - Register Complaint: `POST /complaints`.
   - Get Complaints: `GET /complaints`.
   - Cast Vote: `POST /voting`.
   - Get Votes: `GET /voting`.

3. **Admin Flow**:
   - Login with admin credentials.
   - Get All Users: `GET /users/all`.
   - Delete User: `DELETE /users/<userId>`.
   - Add Food: `POST /food`.
   - Update Food: `PUT /food/<foodId>`.
   - Delete Food: `DELETE /food/<foodId>`.
   - Add Meal: `POST /food/meals`.
   - Use Token: `PUT /tokens/use/<tokenId>`.
   - Get All Complaints: `GET /complaints/all`.
   - Update Complaint: `PUT /complaints/<complaintId>`.
   - Create Election: `POST /voting/election`.
   - Get Election Results: `GET /voting/results/<electionId>`.

---

## Notes
- Replace `<token>` and `<admin-token>` with actual JWT tokens from login responses.
- Use valid IDs (`userId`, `tokenId`, `foodId`, etc.) from previous responses where required.
- Ensure the backend is running (`npm run dev`) and MongoDB is connected.
- Test endpoints sequentially to populate data (e.g., register users before managing tokens).

This manual provides a comprehensive guide to test all CRUD operations via Postman! Let me know if you need further clarification or sample responses.
