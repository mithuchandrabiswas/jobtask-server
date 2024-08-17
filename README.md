
# MyStore

[Live Website](https://job-task-383b4.web.app)

## Project Overview

"MyStore" is a fullstack single-page e-commerce application built using the MERN stack. The project focuses on implementing essential features such as pagination, searching, categorization, and sorting of products. It also includes Firebase-based Google and Email/Password Authentication.

## Features

1. **Pagination**: Efficient product listing with pagination controls for better navigation.
2. **Searching**: Search products by their name.
3. **Categorization**: Filter products based on brand, category, and price range.
4. **Sorting**: Sort products by price (Low to High, High to Low) and date added (Newest first).
5. **Authentication**: Google and Email/Password authentication powered by Firebase.
6. **Responsive Design**: Mobile-first design with fixed-size product cards, a functional Navbar, and a Footer.

## Tech Stack

- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Firebase
- **Deployment**: Firebase Hosting (Frontend), Heroku (Backend)

## Project Setup

### Backend Setup

1. Clone the backend repository:

   ```bash
   git clone <your-backend-repo-link>
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```bash
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Run the server:

   ```bash
   npm run start
   ```

### Frontend Setup

1. Clone the frontend repository:

   ```bash
   git clone <your-frontend-repo-link>
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```bash
   REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
   REACT_APP_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   REACT_APP_FIREBASE_PROJECT_ID=<your-firebase-project-id>
   ```

4. Run the development server:

   ```bash
   npm start
   ```

## Database

You can manually insert dummy data into MongoDB using a script or a tool like MongoDB Compass. Ensure you have at least 40 products with fields like name, image, description, price, category, ratings, and creation date.

## Important Commands

- **Frontend Build**: `npm run build`
- **Backend Start**: `npm run start`
- **Deployment**: Follow Firebase and Heroku deployment guides.

## Contributions

This project includes at least 10 meaningful commits, with code that is clean, well-commented, and follows best practices.

## License

This project is licensed under the MIT License.
