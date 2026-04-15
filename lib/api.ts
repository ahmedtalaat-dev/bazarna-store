// Fetch all products
export async function getProducts() {
  const res = await fetch("https://dummyjson.com/products", {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return data.products;
}

// Fetch a single product by ID
export async function getProductById(id: string) {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}
