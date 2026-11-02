const container = document.getElementById('productDetail');
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
async function loadProduct() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id || !/^\d+$/.test(id)) { showError('That product link is not valid.'); return; }
  try {
    const response = await fetch(`/api/products/${id}`); const product = await response.json();
    if (!response.ok) throw new Error(product.error || 'Product not found.');
    document.title = `${product.name} — ShopStack`;
    container.className = 'detail-layout';
    container.innerHTML = `<div class="detail-image"><img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" onerror="this.src='https://placehold.co/900x900/f0eee9/777?text=ShopStack'"><span class="detail-image-label">THE EVERYDAY EDIT</span></div><div class="detail-copy"><p class="eyebrow">${escapeHtml(product.category.toUpperCase())} / PRODUCT ${String(product.id).padStart(2,'0')}</p><h1>${escapeHtml(product.name)}<span>.</span></h1><p class="detail-price">${money(product.price)}</p><div class="detail-rule"></div><h2>About this product</h2><p class="detail-description">${escapeHtml(product.description)}</p><div class="stock-row"><span class="stock-dot"></span>${product.stock > 0 ? `In stock · ${product.stock} available` : 'Currently out of stock'}</div><div class="detail-note"><span>✳</span><p>Thoughtfully selected for everyday use. Simple, useful and made to fit your routine.</p></div><a class="hero-button detail-continue" href="/#catalogue">Continue exploring <span>↗</span></a><p class="product-id">PRODUCT ID: SS-${String(product.id).padStart(4,'0')}</p></div>`;
  } catch (error) { showError(error.message); }
}
function showError(message) { container.className = 'detail-error'; container.innerHTML = `<h2>Product unavailable</h2><p>${escapeHtml(message)}</p><a href="/">Return to the shop →</a>`; }
loadProduct();
