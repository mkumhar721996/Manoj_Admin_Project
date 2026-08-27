import { useSyncExternalStore } from "react";

type Listener = () => void;

let cartItems: string[] = [];
const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function addItem(id: string): void {
  cartItems.push(id);
  notify();
}

export function removeItem(id: string): void {
  const index = cartItems.indexOf(id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  notify();
}

export function getItemCount(): number {
  return cartItems.length;
}

export function subscribeToCart(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetCart(): void {
  cartItems = [];
}

export function useCartItemCount(): number {
  return useSyncExternalStore(subscribeToCart, getItemCount);
}
