# EverGlow Skincare & Makeup - Frontend

A modern, responsive **e-commerce frontend** built with **Next.js 13 App Router**, **Tailwind CSS**, **shadcn/ui**, and **Lucide icons**.  
Products are fetched from the [Makeup API](http://makeup-api.herokuapp.com/api/v1/products.json). This project demonstrates a professional, interview-ready frontend with dynamic routing, modular components, dark mode, and an admin panel structure.

---

## 🛠️ Features

### ✅ Completed

- [x] Next.js App Router (`app/` folder)
- [x] Dynamic product pages (`products/[id]/page.tsx`)
- [x] Product listing page with responsive grid
- [x] Product detail page with image, price, description
- [x] Products fetched from the Makeup API
- [x] Authentication UI pages (login, register, forgot password) using route groups
- [x] Admin section (pages are scaffolded and implemented):
  - [x] `admin/products`
  - [x] `admin/categories`
  - [x] `admin/orders`
  - [x] `admin/customers`
  - [x] `admin/settings`
- [x] Dark mode toggle with `DarkModeProvider`
- [x] Reusable UI components (implemented):
  - [x] `Card` (`components/Card/Card.tsx`)
  - [x] `ProductCard` (`components/ProductCard/ProductCard.tsx`)
  - [x] `Navbar` (`components/Navbar/Navbar.tsx`)
- [x] UI primitives in `ui/` (examples):
  - [x] `button.tsx`
  - [x] `input.tsx`
- [x] Icons with **Lucide** (cart, favorites, etc.)
- [x] Responsive UI with Tailwind CSS
- [x] Styled components using **shadcn/ui**  

### ⏳ Upcoming / Improvements
- [ ] Cart state management (Context API or Zustand)
- [ ] Add-to-Cart functionality fully integrated
- [ ] Admin route protection (fake auth check / redirect)
- [ ] Category filtering for products
- [ ] Search functionality for products

### 🔁 Notes
- The project currently fetches product data from the public Makeup API. No API keys are required for development.
- Admin routes are present as UI-only pages (no backend/auth guard yet).

---

## 🚀 Getting started

1. Clone the repository and open the `frontend` folder:

```powershell
cd frontend
npm install
npm run dev
```

2. Open http://localhost:3000 in your browser.

No additional environment variables are required for the public Makeup API.

---

## 🤝 Contributing

Contributions are welcome — open an issue or a pull request for improvements, bug fixes, or new features.

---

## 📄 License

This project is open source. Add a license here (e.g., MIT) if desired.

---

## 🔗 Tech Stack
- **Framework:** Next.js 13+ App Router  
- **Styling:** Tailwind CSS  
- **UI Components:** shadcn/ui  
- **Icons:** Lucide React  
- **Data Source:** [Makeup API](http://makeup-api.herokuapp.com/api/v1/products.json)  

---

## 📂 Folder Structure

app/
├─ layout.tsx
├─ page.tsx
├─ products/
│ └─ [id]/page.tsx
├─ authpage/
│ ├─ login/page.tsx
│ ├─ register/page.tsx
│ └─ forgot-password/page.tsx
components/
├─ Card/
│ └─ Card.tsx
├─ ProductCard/
│ └─ ProductCard.tsx
├─ Navbar/
│ └─ Navbar.tsx
├─ DarkModeProvider/
│ └─ DarkModeProvider.tsx
ui/
├─ button.tsx
├─ input.tsx


---

