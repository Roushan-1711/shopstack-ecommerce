const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const emptyState = document.getElementById('emptyState');
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
let searchTimer;

async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    data.categories.forEach(category => {
      const option = document.createElement('option'); option.value = category; option.textContent = category; categoryFilter.appendChild(option);
    });
  } catch (error) { console.error('Could not load categories:', error); }
}

function productCard(product, index) {
  return `<a class="product-card" href="/product.html?id=${product.id}" style="--card-delay:${index * 45}ms"><div class="product-image-wrap"><img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='https://placehold.co/700x700/f0eee9/777?text=ShopStack'"><span class="product-category">${escapeHtml(product.category)}</span><span class="card-arrow">↗</span></div><div class="product-info"><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p></div><strong>${money(product.price)}</strong></div></a>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }

async function loadProducts() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('q', searchInput.value.trim());
  if (categoryFilter.value) params.set('category', categoryFilter.value);
  if (minPrice.value !== '') params.set('minPrice', minPrice.value);
  if (maxPrice.value !== '') params.set('maxPrice', maxPrice.value);
  grid.innerHTML = '<div class="loading-state">Finding the good stuff...</div>';
  try {
    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load products.');
    document.getElementById('resultCount').textContent = `Showing ${data.count} ${data.count === 1 ? 'product' : 'products'}`;
    grid.innerHTML = data.products.map(productCard).join('');
    emptyState.classList.toggle('hidden', data.count !== 0);
    grid.classList.toggle('hidden', data.count === 0);
  } catch (error) {
    grid.innerHTML = `<div class="loading-state error-state">${escapeHtml(error.message)}</div>`;
  }
}
function clearFilters() { searchInput.value = ''; categoryFilter.value = ''; minPrice.value = ''; maxPrice.value = ''; loadProducts(); }
searchInput.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(loadProducts, 250); });
[categoryFilter, minPrice, maxPrice].forEach(input => input.addEventListener('change', loadProducts));
document.getElementById('clearFilters').addEventListener('click', clearFilters);
document.getElementById('resetEmpty').addEventListener('click', clearFilters);
loadCategories(); loadProducts();
