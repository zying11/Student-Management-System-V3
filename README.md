# Tuition Center Student Management System

📚 **Help Us Improve Tuition Centers!**  
We are final year students from the Faculty of Computer Science and Information Technology, Universiti Malaya, working on a web-based **Student Management System** for tuition centers. This project aims to streamline the management of students, classes, and schedules for tuition centers.

**Students In-charge:**
- Ham Zhi Ying
- Regina Tang Hue Yan

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
   - [Cloning the Repository](#1-clone-the-repository)
   - [Install Composer Dependencies](#2-install-composer-dependencies)
   - [Set Up the Frontend (React)](#3-set-up-the-frontend-react)
   - [Database Setup](#4-database-setup)
4. [Usage](#usage)
5. [Additional Resources](#additional-resources)
   
---

## Overview

Our project aims to address the limitations of existing systems by designing and developing a **web-based Student Management System (SMS)** specifically tailored for tuition centers. The system offers a variety of modules to enhance the efficiency of administrative and academic processes. These modules include:

- **Student-Teacher Profile Management**  
- **Fee Management**  
- **Student Assessment Feedback**  
- **Attendance Records**  
- **Alerts and Notifications**  
- **Timetable Management**

The SMS streamlines processes, improves communication, and enhances data security. This leads to more time for core educational activities, better-informed decision-making, and ultimately, a more supportive learning environment for students.

---

## Prerequisites

Before you begin, ensure you have the following tools installed:

- **Composer**: A tool for dependency management in PHP.
  - [Download Composer](https://getcomposer.org/)
  
- **Node.js and NPM**: Node.js is required for the frontend, and NPM is needed to manage dependencies.
  - [Download Node.js](https://nodejs.org/)

- **XAMPP** (or any PHP/MySQL stack): For local development with a database.
  - [Download XAMPP](https://www.apachefriends.org/)

---

## Setup Instructions

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository

Since this is a private project, please refer to the video tutorial on how to clone it using SSH:

- [How to Clone a Private Repository](https://www.youtube.com/watch?v=NvvIuqj4YTY)

### 2. Install Composer Dependencies

- First, check if Composer is installed by running:
  ```bash
  composer
  ```
  If Composer is not installed, follow the [installation guide](https://getcomposer.org/doc/).

- In your terminal, navigate to the project directory and Laravel folder, then run:
  ```bash
  composer global require laravel/installer
  composer install
  php artisan serve
  ```

  **Note**: If you encounter any issues with Composer not being found, run the following:
  ```bash
  composer global require laravel/installer
  composer install
  ```

For more information on setting up Laravel, visit the [Laravel Installation Documentation](https://laravel.com/docs/11.x/installation).

### 3. Set Up the Frontend (React)

- Install Node.js and NPM if you haven't already.
- Navigate to the `react` folder inside the project directory and run:
  ```bash
  npm install
  npm run dev
  ```

  For React setup instructions, refer to this [video tutorial](https://www.youtube.com/watch?v=uiD2aoL7zHs&t=486s).

### 4. Database Setup

- Duplicate `.env.example` and rename it to `.env`.
- Run the following command to generate the application key:
  ```bash
  php artisan key:generate
  ```

- Create an empty database in your local database management tool (e.g., phpMyAdmin).

- Update the `.env` file with the database settings:
  ```env
  DB_CONNECTION=sqlite
  DB_DATABASE=C:\xampp\htdocs\student-management-system\database\database.sqlite
  ```

- Run the database migrations to set up the tables:
  ```bash
  php artisan migrate
  ```
  
---

## Usage

Once the project is set up and running:

1. **Access the application**:
   - Navigate to `http://localhost:3000` in your browser to access the Student Management System.

---

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs/11.x/installation)
- [Composer Documentation](https://getcomposer.org/doc/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

