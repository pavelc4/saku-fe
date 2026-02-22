import { writable, derived } from 'svelte/store';
import type { CartItem } from '../types';

const _items = writable<CartItem[]>([]);

export const items = { subscribe: _items.subscribe };

export const totalAmount = derived(_items, ($items) =>
	$items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);

export const itemCount = derived(_items, ($items) =>
	$items.reduce((sum, item) => sum + item.quantity, 0)
);

export function addItem(productId: string, product: CartItem['product'], quantity = 1): void {
	_items.update((current) => {
		const existing = current.findIndex((i) => i.product.id === productId);
		if (existing !== -1) {
			return current.map((i, idx) =>
				idx === existing ? { ...i, quantity: i.quantity + quantity } : i
			);
		}
		return [...current, { product, quantity }];
	});
}

export function removeItem(index: number): void {
	_items.update((current) => current.filter((_, i) => i !== index));
}

export function updateQuantity(index: number, quantity: number): void {
	if (quantity <= 0) {
		removeItem(index);
		return;
	}
	_items.update((current) =>
		current.map((item, i) => (i === index ? { ...item, quantity } : item))
	);
}

export function clearCart(): void {
	_items.set([]);
}
