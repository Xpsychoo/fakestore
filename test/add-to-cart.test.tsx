import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToCart } from "@/components/add-to-cart";
import { WishlistButton } from "@/components/wishlist-button";
import { setCart, setWishlist } from "@/lib/store";
import { PRODUCTS } from "./fixtures";

const product = PRODUCTS[0]!;

afterEach(() => {
  setCart([]);
  setWishlist([]);
});

it("adds the chosen quantity to the saved cart", async () => {
  const user = userEvent.setup();
  render(<AddToCart product={product} />);

  await user.click(screen.getByRole("button", { name: "Increase quantity" }));
  await user.click(screen.getByRole("button", { name: "Add to cart" }));

  expect(screen.getByRole("button", { name: "Added to cart" })).toBeInTheDocument();
  expect(screen.getByText(/2 in your cart/)).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("shopora.cart")!)).toEqual([
    { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 2 },
  ]);
});

it("toggles a product in the wishlist", async () => {
  const user = userEvent.setup();
  render(<WishlistButton id={product.id} title={product.title} />);

  const button = screen.getByRole("button", { name: `Save ${product.title} to wishlist` });
  await user.click(button);
  expect(button).toHaveAttribute("aria-pressed", "true");
  expect(JSON.parse(localStorage.getItem("shopora.wishlist")!)).toEqual([product.id]);

  await user.click(button);
  expect(button).toHaveAttribute("aria-pressed", "false");
});
