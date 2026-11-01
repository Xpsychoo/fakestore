import { addItem, itemCount, MAX_QUANTITY, parseCart, removeItem, SHIPPING_FEE, setQuantity, totals } from "@/lib/cart";
import { validateAddress } from "@/lib/checkout";
import { PRODUCTS } from "./fixtures";

const [backpack, shirt] = PRODUCTS as [(typeof PRODUCTS)[0], (typeof PRODUCTS)[0]];

describe("cart", () => {
  it("adds new products and merges repeats", () => {
    let cart = addItem([], backpack, 2);
    cart = addItem(cart, shirt);
    cart = addItem(cart, backpack);
    expect(cart.map((i) => [i.id, i.quantity])).toEqual([
      [1, 3],
      [2, 1],
    ]);
    expect(itemCount(cart)).toBe(4);
  });

  it("keeps quantities between 1 and the maximum", () => {
    const cart = addItem([], backpack, 50);
    expect(cart[0]!.quantity).toBe(MAX_QUANTITY);
    expect(setQuantity(cart, 1, 0)[0]!.quantity).toBe(1);
  });

  it("removes items", () => {
    expect(removeItem(addItem([], backpack), 1)).toEqual([]);
  });

  it("charges shipping below the free-shipping threshold only", () => {
    expect(totals([])).toEqual({ subtotal: 0, shipping: 0, total: 0 });
    expect(totals(addItem([], shirt, 2))).toEqual({ subtotal: 44.6, shipping: SHIPPING_FEE, total: 54.59 });
    expect(totals(addItem([], backpack)).shipping).toBe(0);
  });

  it("rounds totals to cents", () => {
    const { subtotal } = totals([{ id: 1, title: "x", price: 0.1, image: "", quantity: 3 }]);
    expect(subtotal).toBe(0.3);
  });

  it("drops invalid saved items", () => {
    const good = addItem([], backpack)[0];
    expect(parseCart("nope")).toBeNull();
    expect(parseCart([good, { id: 2, title: "x", price: 1, image: "https://evil.example/x.png", quantity: 1 }, { ...good, quantity: 99 }, null])).toEqual([good]);
  });
});

describe("validateAddress", () => {
  const valid = { name: "John Doe", email: "john@gmail.com", phone: "1-570-236-7033", street: "7682 New Road", city: "Kilcoole", zip: "12926-3874" };

  it("accepts a complete address", () => {
    expect(validateAddress(valid)).toEqual({});
  });

  it("reports each problem field", () => {
    expect(Object.keys(validateAddress({ ...valid, email: "john@", phone: "12", zip: "!" })).sort()).toEqual(["email", "phone", "zip"]);
  });
});
