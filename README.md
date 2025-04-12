# ✅ Task Manager App

A professional productivity app built with **React**, **TypeScript**, and **Auth0** to manage tasks, subtasks, reminders, and calendar scheduling with modern UI and features.

---

## 🚀 Features

### ✅ Core Features (from Requirements)

- **Task Dashboard Page**  
  - View all tasks with filter, sort, and search
  - Quickly navigate to details or edit a task
  - Clear all functionality included

- **Task Details Page**  
  - View full task data including notes and subtasks
  - Link to edit the selected task

- **Task Creation & Editing**  
  - Add new or edit existing tasks with forms
  - All forms fully typed and validated via TypeScript
  - Auto-populated fields for editing

- **Authentication & Authorization (Auth0)**  
  - Login & logout flow using Auth0
  - Auth0 protected routes using a `PrivateRoute` wrapper
  - User name and avatar shown in navigation

- **TypeScript Integration**  
  - Fully typed props, state, context, hooks, and components
  - `types.ts` defines the shape of each `Task`, `Subtask`, etc.

- **Context API for Global Task State**  
  - Add, update, delete tasks globally via context
  - All interactions reflect across views instantly

- **Error Handling and Validation**  
  - Input validation for task fields
  - Default values and error fallback behavior implemented

---

## ✨ Extended Features (Extra Functionality)

### 🗂️ Extended Task Model

- **Subtasks** support with completion checkbox and title
- **Recurring Tasks** (`daily`, `weekly`, `monthly`, `none`)
- **Reminders** — "Remind me X minutes before"
- **Estimated Time** tracking (minutes)
- **Rich Notes** field for task descriptions

### 📅 Calendar View

- Full calendar interface using `react-big-calendar`
- Color-coded tasks based on **priority** (`🔴 High`, `🟡 Medium`, `🟢 Low`)
- View tasks by **month**, **week**, or **day**
- Click date to open **popup task modal**
- Create task directly from calendar view

### 🎨 UI & UX

- **Dark Mode Support** with toggle
- Uses CSS variables like `--bg`, `--text`, `--card-bg`
- Responsive and mobile-first layout
- Animated floating “+ Add Task” calendar button
- Elegant modal for task creation

---

## 🛠️ Tech Stack

- **React + Vite**
- **TypeScript**
- **React Router DOM**
- **Auth0 Authentication**
- **React Context API**
- **React Big Calendar**
- **uuid** for task IDs
- **CSS Modules** for styling

---

## 🔐 Auth Setup

Create a `.env` file:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

Register your app in Auth0 and make sure the **callback URL** is:  
`http://localhost:5173`

---

## ▶️ Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## 📁 Folder Structure

```
src/
├── components/       # NavBar, PrivateRoute, etc.
├── context/          # TaskContext provider
├── pages/            # Dashboard, TaskForm, TaskDetails, CalendarPage
├── styles/           # CSS Modules
├── types.ts          # Global TypeScript interfaces
├── App.tsx, main.tsx
```

