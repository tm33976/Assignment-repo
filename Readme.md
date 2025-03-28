# EmployWise Assignment - User Management Application

A React application that integrates with the Reqres API to perform basic user management functions including authentication, listing users, and performing CRUD operations.

## Author

**Tushar Mishra**  
Email: tm3390782@gmail.com

## Tech Stack

This project is built with the following technologies:

- **React**: JavaScript library for building user interfaces
- **Next.js**: React framework with built-in routing and server-side rendering
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **shadcn/ui**: High-quality, accessible component library
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Context API**: For global state management
- **Fetch API**: For making HTTP requests
- **localStorage**: For persisting authentication state

## Features

### Level 1: Authentication

- Login screen with email and password
- JWT token storage
- Protected routes

### Level 2: User Listing

- Paginated list of users
- Display of user details (name, email, avatar)
- Responsive table layout

### Level 3: User Management

- Edit user information
- Delete users
- Success/error notifications

### Bonus Features

- Client-side search and filtering
- Next.js App Router for navigation
- Fully responsive design

## Usage

- Navigate to the login page and enter valid credentials.
- After authentication, users can view a paginated list of users.
- Edit or delete users as needed.
- Use the search and filtering functionality for quick access.

## API Integration

This project uses the **Reqres API** for user data management. API endpoints include:

- **Authentication:** `POST /login`
- **Fetch Users:** `GET /users?page=1`
- **Update User:** `PUT /users/:id`
- **Delete User:** `DELETE /users/:id`
#   A s s i g n m e n t _ r e p o  
 