# Setup

1. Run command npm install

2. Create .env file add variabales and value in that
   2.1 SALT_ROUNDS =10
   2.2 JWT_SECRET_ACCESS_KEY_USER = uUfG5lPwR2xN6vZ9!@123
   2.3 JWT_REFRESH_KEY_USER = tTgB7qS1yF3hJ8kM!@456
   2.4 JWT_RANDOM_SECRET_KEY_USER = JwT53cr3tK3y!@789

3. Run command npm start

# About Project APIS

API Routes Description
This section outlines the API routes necessary for the application, focusing on user authentication, department management, employee management, and filtering functionalities.

1. Authentication Routes
   POST /signup
   Description: Allows new users (both employees and managers) to create an account.

POST /login
Description: Allows existing users to log in.

2. Department Management Routes (Managers Only)
   POST /departments

GET /department
Description: Retrieve all departments.

POST /departments/:id
Description: Update an existing department.

DELETE /departments/:id
Description: Delete an existing department.

3. Employee Management Routes
   POST users/employee
   Description: Create a new employee.

GET /employee
Description: Retrieve all employees.

PUT users/employees/
(Managers Only)
Description: Update an existing employee.

DELETE users/employees/:id
(Managers Only)
Description: Delete an existing employee.

4. Employee Filtering Routes
   GET users/employees?sortField=""&sortOrder=""

Description: Retrieve employees sorted by name or by location in ascending or descending order.
Query Parameters: order (values: "asc" or "desc")

#Summary

These API routes provide comprehensive functionalities for user authentication, department management, employee management, and data filtering. By integrating these endpoints into the frontend, the application ensures secure and efficient handling of data, enabling managers and employees to perform their tasks effectively.
