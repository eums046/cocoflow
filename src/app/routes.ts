import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { SellerLayout } from "./components/SellerLayout";
import { HomePage } from "./pages/buyer/HomePage";
import { LoginPage } from "./pages/buyer/LoginPage";
import { RegisterPage } from "./pages/buyer/RegisterPage";
import { StorefrontPage } from "./pages/buyer/StorefrontPage";
import { ProductsPage } from "./pages/buyer/ProductsPage";
import { CartPage } from "./pages/buyer/CartPage";
import { CheckoutPage } from "./pages/buyer/CheckoutPage";
import { TransactionsPage } from "./pages/buyer/TransactionsPage";
import { ProfilePage } from "./pages/buyer/ProfilePage";
import { SellerLoginPage } from "./pages/seller/SellerLoginPage";
import { SellerDashboardPage } from "./pages/seller/SellerDashboardPage";
import { SellerStorefrontPage } from "./pages/seller/SellerStorefrontPage";
import { InventoryPage } from "./pages/seller/InventoryPage";
import { ReportsPage } from "./pages/seller/ReportsPage";

import { SellerRegisterPage } from "./pages/seller/SellerRegisterPage";

export const router = createBrowserRouter([
  // Buyer routes (with header/footer layout)
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "storefront", Component: StorefrontPage },
      { path: "products", Component: ProductsPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "transactions", Component: TransactionsPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
  // Seller registration (standalone, no sidebar)
  {
    path: "/seller/register",
    Component: SellerRegisterPage,
  },
  // Seller login (standalone, no sidebar)
  {
    path: "/seller/login",
    Component: SellerLoginPage,
  },
  // Seller portal (with sidebar layout)
  {
    path: "/seller",
    Component: SellerLayout,
    children: [
      { index: true, Component: SellerDashboardPage },
      { path: "dashboard", Component: SellerDashboardPage },
      { path: "storefront", Component: SellerStorefrontPage },
      { path: "inventory", Component: InventoryPage },
      { path: "reports", Component: ReportsPage },
    ],
  },
]);
