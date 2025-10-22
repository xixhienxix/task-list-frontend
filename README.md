# Task List Angular Project

A full-featured **Task Manager** web application built with **Angular**, **TypeScript**, and **Firebase**, designed to manage tasks with CRUD functionality, authentication, and real-time updates.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Authentication](#authentication)
8. [Task Management](#task-management)
9. [Deployment](#deployment)
10. [CI/CD Integration](#cicd-integration)
11. [Contributing](#contributing)
12. [License](#license)

---

## Project Overview

This Angular Task List app allows users to:

* Sign up and log in with email.
* Create, read, update, and delete tasks.
* Track the status of each task (completed/pending).
* Receive real-time updates using **BehaviorSubject** for state management.
* View a responsive UI built with **Angular Material** components.

---

## Features

* **Authentication:** Simple login and registration using Firebase backend.
* **Task CRUD Operations:** Full management of tasks (create, edit, delete).
* **State Management:** BehaviorSubject to keep task list reactive.
* **Responsive UI:** Built with Angular Material and responsive CSS.
* **Notifications:** Feedback dialogs for successful operations.
* **Spinner Component:** Reusable loading indicator during async operations.
* **Routing Guards:** AuthGuard ensures protected routes are only accessible by logged-in users.

---

## Tech Stack

* **Frontend:** Angular 20+, TypeScript
* **UI Library:** Angular Material
* **Backend:** Firebase Functions (optional)
* **Hosting:** Firebase Hosting
* **State Management:** RxJS BehaviorSubject

---

## Project Structure

```
task-list/
│
├── frontend/                  # Angular frontend project
│   ├── src/                   # Source code
│   │   ├── app/
│   │   │   ├── _services/     # API and state services
│   │   │   ├── _helpers/      # Spinner and modals
│   │   │   ├── _modals/       # Dialog components
│   │   │   ├── auth/          # Authentication pages
│   │   │   └── task/          # Task management pages
│   │   └── assets/            # Static assets
│   ├── angular.json           # Angular workspace configuration
│   ├── package.json           # Project dependencies
│   └── firebase.json          # Firebase Hosting config
│
├── functions/                 # Optional Firebase functions
├── .github/workflows/         # CI/CD workflow files
└── README.md                  # Project documentation
```

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/<your-username>/task-list.git
cd task-list/frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
   Edit `src/environments/environment.ts` to point to your backend URL:

```ts
export const environment = {
  production: false,
  backendURL: 'https://your-backend-url.com'
};
```

---

## Usage

1. **Start the development server:**

```bash
ng serve
```

2. **Access the app:**

Open [http://localhost:4200](http://localhost:4200) in your browser.

3. **Build for production:**

```bash
ng build --configuration production
```

4. **Serve the production build locally (optional):**

```bash
npx http-server dist/task-list
```

---

## Authentication

* Users can **register** and **log in** using email.
* AuthGuard ensures protected routes are only accessible for authenticated users.
* Session is stored in `localStorage` (email token).

---

## Task Management

* **Add Task:** Create new tasks with title and description.
* **Edit Task:** Modify task details or status.
* **Delete Task:** Remove tasks permanently.
* **Toggle Status:** Mark tasks as complete or pending.
* **Reactive List:** Task list updates automatically without page refresh.

---

## Deployment

This project is hosted on **Firebase Hosting**:

1. **Build the project:**

```bash
ng build --configuration production
```

2. **Deploy:**

```bash
firebase deploy --only hosting
```

> Ensure `firebase.json` points to the correct `public` folder:

```json
{
  "hosting": {
    "public": "dist/task-list",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

---

## CI/CD Integration

* The project includes a **GitHub Actions workflow** (`deploy.yml`) for automated build and deployment.
* Every push to the `main` branch triggers:

  1. Checkout repository
  2. Install dependencies
  3. Build Angular project
  4. Deploy to Firebase Hosting

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Create a Pull Request

---

## License

This project is licensed under the **MIT License**.
