import { projectId, publicAnonKey } from "/utils/supabase/info";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabase = createClient(supabaseUrl, publicAnonKey);

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
export async function apiLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, message: error.message };
  
  const user = {
    id: data.user.id,
    email: data.user.email!,
    password, 
    name: data.user.user_metadata?.name || '',
    address: data.user.user_metadata?.address || '',
    mobile: data.user.user_metadata?.mobile || '',
    createdAt: data.user.created_at
  };
  return { success: true, user };
}

export async function apiRegister(data: {
  email: string;
  password: string;
  name: string;
  address: string;
  mobile: string;
}) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        address: data.address,
        mobile: data.mobile,
      }
    }
  });

  if (error) return { success: false, message: error.message };
  
  const user = {
    id: authData.user?.id!,
    email: data.email,
    password: data.password,
    name: data.name,
    address: data.address,
    mobile: data.mobile,
    createdAt: authData.user?.created_at!
  };
  return { success: true, user };
}

export async function apiSellerRegister(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'seller' } }
  });
  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function apiSellerLogin(email: string, password: string) {
  // Allow hardcoded fallback for the prototype
  if (email === "seller@cocofiber.ph" && password === "seller123") {
    return { success: true };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, message: error.message };
  
  if (data.user.user_metadata?.role !== 'seller') {
    return { success: false, message: "This account is not registered as a seller." };
  }
  return { success: true };
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
