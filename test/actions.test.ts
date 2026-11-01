import { login, placeOrder } from "@/lib/actions";

vi.mock("server-only", () => ({}));

const tokenFor = (sub: number) => `header.${Buffer.from(JSON.stringify({ sub, user: "johnd" })).toString("base64url")}.signature`;

const apiUser = {
  id: 1,
  username: "johnd",
  email: "john@gmail.com",
  phone: "1-570-236-7033",
  name: { firstname: "john", lastname: "doe" },
  address: { street: "new road", number: 7682, city: "kilcoole", zipcode: "12926-3874" },
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

afterEach(() => vi.unstubAllGlobals());

describe("login", () => {
  it("signs in and loads the user named in the token", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ token: tokenFor(1) })).mockResolvedValueOnce(json(apiUser));
    vi.stubGlobal("fetch", fetch);

    const result = await login(" johnd ", "m38rmF$");

    expect(fetch.mock.calls[0]![0]).toBe("https://fakestoreapi.com/auth/login");
    expect(JSON.parse(fetch.mock.calls[0]![1].body)).toEqual({ username: "johnd", password: "m38rmF$" });
    expect(fetch.mock.calls[1]![0]).toBe("https://fakestoreapi.com/users/1");
    expect(result).toEqual({
      ok: true,
      session: {
        token: tokenFor(1),
        user: {
          id: 1,
          username: "johnd",
          email: "john@gmail.com",
          phone: "1-570-236-7033",
          name: "John Doe",
          address: { street: "7682 New Road", city: "Kilcoole", zip: "12926-3874" },
        },
      },
    });
  });

  it("explains wrong credentials", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("username or password is incorrect", { status: 401 })));
    expect(await login("johnd", "nope")).toEqual({ ok: false, error: "That username and password don't match." });
  });

  it("does not call the API without credentials", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect((await login("", "")).ok).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("handles network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    expect(await login("johnd", "m38rmF$")).toMatchObject({ ok: false });
  });
});

describe("placeOrder", () => {
  const items = [{ id: 1, title: "Backpack", price: 109.95, image: "https://fakestoreapi.com/img/1.png", quantity: 2 }];
  const address = { name: "John Doe", email: "john@gmail.com", phone: "1-570-236-7033", street: "7682 New Road", city: "Kilcoole", zip: "12926" };

  it("posts the cart to the API", async () => {
    const fetch = vi.fn().mockResolvedValue(json({ id: 11 }, 201));
    vi.stubGlobal("fetch", fetch);

    expect(await placeOrder(items, address, 3)).toEqual({ ok: true });
    expect(fetch.mock.calls[0]![0]).toBe("https://fakestoreapi.com/carts");
    expect(JSON.parse(fetch.mock.calls[0]![1].body)).toMatchObject({ userId: 3, products: [{ id: 1, price: 109.95 }] });
  });

  it("rejects empty carts and invalid addresses without calling the API", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await placeOrder([], address)).toEqual({ ok: false, error: "Your cart is empty." });
    expect(await placeOrder(items, { ...address, email: "bad" })).toEqual({ ok: false, error: "Check your delivery details." });
    expect(fetch).not.toHaveBeenCalled();
  });
});
