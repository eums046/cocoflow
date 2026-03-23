import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-10539df9`;

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

async function request<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...HEADERS, ...(options?.headers ?? {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

// ── Auth ───────────────────────────────────────────────────────────────────
export function apiLogin(email: string, password: string) {
  return request<{ success: boolean; user?: object; message?: string }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export function apiRegister(data: {
  email: string;
  password: string;
  name: string;
  address: string;
  mobile: string;
}) {
  return request<{ success: boolean; user?: object; message?: string }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export function apiSellerLogin(email: string, password: string) {
  return request<{ success: boolean; message?: string }>(
    "/auth/seller-login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

// ── Users ──────────────────────────────────────────────────────────────────
export function apiGetUser(id: string) {
  return request<object>(`/users/${id}`);
}

export function apiUpdateUser(id: string, data: object) {
  return request<object>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ── Products ───────────────────────────────────────────────────────────────
export function apiGetProducts() {
  return request<object[]>("/products");
}

export function apiAddProduct(product: object) {
  return request<object>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function apiUpdateProduct(id: string, product: object) {
  return request<object>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function apiDeleteProduct(id: string) {
  return request<{ success: boolean }>(`/products/${id}`, {
    method: "DELETE",
  });
}

// ── Orders ─────────────────────────────────────────────────────────────────
export function apiGetOrders() {
  return request<object[]>("/orders");
}

export function apiGetUserOrders(userId: string) {
  return request<object[]>(`/orders/user/${userId}`);
}

export function apiPlaceOrder(order: object) {
  return request<object>("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function apiUpdateOrderStatus(id: string, status: string) {
  return request<{ success: boolean }>(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ── Storefront ─────────────────────────────────────────────────────────────
export function apiGetStorefront() {
  return request<object>("/storefront");
}

export function apiUpdateStorefront(config: object) {
  return request<object>("/storefront", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}
