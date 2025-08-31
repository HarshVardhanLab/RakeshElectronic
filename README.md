# Rakesh Electronics

![Rakesh Electronics Screenshot](https://via.placeholder.com/1200x600.png?text=Rakesh+Electronics+Website+Screenshot)
*<p align="center">Add a screenshot of your project here!</p>*

A modern, responsive, and feature-rich website for Rakesh Electronics, an electronics repair and sales business. Built with a professional design system, it offers a seamless user experience for customers looking to explore services, view products, and book repairs.

---

## ✨ Features

-   **Responsive Design**: Fully functional and visually appealing on all devices, from mobile phones to desktops.
-   **Dark & Light Mode**: A theme toggle allows users to switch between light, dark, and system-default themes.
-   **Interactive UI Components**: Built with the high-quality, accessible components from **shadcn/ui**.
-   **Book a Repair Service**: A user-friendly dialog form for customers to book repair services, complete with form validation and toast notifications.
-   **Dynamic Sections**: Clearly defined sections for Home, Services, Products, and Contact information.
-   **Professional Theming**: A clean, professional design system implemented with Tailwind CSS and custom CSS variables.

---

## 🛠️ Tech Stack

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **State Management**: [React Query](https://tanstack.com/query/latest) for server state.
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation.
-   **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
-   **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for toast messages.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Rakesh-electronic
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the Vite development server, run the following command. The site will be available at `http://localhost:8080`.

```bash
npm run dev
```

### Building for Production

To create a production-ready build of the application, run:

```bash
npm run build
```

This will generate a `dist` folder with the optimized static assets.

---

## 🚢 Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com/).

A deployment script (`deploy.sh`) is included to streamline the process.

1.  **Log in to the Vercel CLI:**
    ```bash
    vercel login
    ```

2.  **Make the script executable:**
    ```bash
    chmod +x deploy.sh
    ```

3.  **Run the deployment script:**
    ```bash
    ./deploy.sh
    ```

The script will handle installing the Vercel CLI, linking the project, building the assets, and deploying to production.

---

## 📂 Project Structure

The project follows a standard Vite + React structure, with key directories organized as follows:

```
Rakesh-electronic/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── BookRepairDialog.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks (e.g., use-toast)
│   ├── lib/             # Utility functions (e.g., cn)
│   ├── pages/           # Page components for routing
│   │   ├── App.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── index.css        # Global styles and Tailwind directives
│   └── main.tsx         # Main application entry point
├── deploy.sh            # Deployment script for Vercel
├── package.json
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE