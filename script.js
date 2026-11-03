const products = {
  gow1:{name:"God of War I",price:45000},gow2:{name:"God of War II",price:50000},gow18:{name:"God of War (2018)",price:75000},gowr:{name:"God of War Ragnarök",price:150000},
  agent:{name:"007: Agent Under Fire",price:40000},black:{name:"BLACK",price:45000},mario64:{name:"Super Mario 64",price:65000},gta:{name:"GTA: San Andreas",price:40000},
  re4:{name:"Resident Evil 4",price:45000},fc26:{name:"EA SPORTS FC 26",price:220000},cod:{name:"Call of Duty",price:210000},spiderman:{name:"Marvel's Spider-Man 2",price:190000},
  ps5:{name:"PlayStation 5 Slim",price:2350000},xboxs:{name:"Xbox Series S",price:1350000},switch:{name:"Nintendo Switch OLED",price:1250000},ps2:{name:"PlayStation 2",price:350000},control:{name:"Control inalámbrico",price:180000}
};
let cart = [];
const money = value => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(value);
const cartDrawer=document.getElementById('cartDrawer'),overlay=document.getElementById('overlay'),toast=document.getElementById('toast');
function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1900)}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById('cartCount').textContent=count;
  document.getElementById('drawerCount').textContent=`(${count})`;
  const container=document.getElementById('cartItems');
  if(!cart.length){container.innerHTML='<p class="empty-cart">Tu próxima aventura empieza añadiendo un producto. 🎮</p>'}
  else{container.innerHTML=cart.map(item=>`<div class="cart-line"><div><strong>${item.name}</strong><small>${money(item.price)} × ${item.qty}</small></div><div><strong>${money(item.price*item.qty)}</strong><button data-remove="${item.id}" aria-label="Quitar producto">✕</button></div></div>`).join('')}
  document.getElementById('cartTotal').textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
}
function openCart(){cartDrawer.classList.add('open');overlay.classList.add('show');cartDrawer.setAttribute('aria-hidden','false')}
function closeCart(){cartDrawer.classList.remove('open');overlay.classList.remove('show');cartDrawer.setAttribute('aria-hidden','true')}
document.querySelectorAll('.add-cart').forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.id,product=products[id],found=cart.find(item=>item.id===id);
  if(found)found.qty++;else cart.push({id,...product,qty:1});
  renderCart();showToast(`${product.name} añadido al carrito`);
}));
document.getElementById('cartButton').addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
overlay.addEventListener('click',closeCart);
document.getElementById('cartItems').addEventListener('click',event=>{
  const id=event.target.dataset.remove;if(!id)return;
  const item=cart.find(product=>product.id===id);if(item.qty>1)item.qty--;else cart=cart.filter(product=>product.id!==id);renderCart();
});
document.getElementById('checkoutButton').addEventListener('click',()=>{
  if(!cart.length){showToast('Agrega al menos un producto primero');return}
  const lines=cart.map(item=>`• ${item.name} x${item.qty} — ${money(item.price*item.qty)}`).join('\n');
  const total=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
  const message=encodeURIComponent(`¡Hola! Quiero consultar este pedido de Juegos y Más:\n${lines}\nTotal estimado: ${total}\n¿Me confirman disponibilidad?`);
  // Reemplaza 573000000000 por el WhatsApp real de la tienda.
  window.open(`https://wa.me/573000000000?text=${message}`,'_blank','noopener');
});
const searchInput=document.getElementById('searchInput');
let activeFilter='todos';
function filterProducts(){
  const query=searchInput.value.toLowerCase().trim();
  document.querySelectorAll('.product-card').forEach(card=>{
    const matchesFilter=activeFilter==='todos'||card.dataset.category===activeFilter;
    const matchesQuery=card.dataset.name.toLowerCase().includes(query)||card.textContent.toLowerCase().includes(query);
    card.classList.toggle('hidden',!(matchesFilter&&matchesQuery));
  });
}
searchInput.addEventListener('input',filterProducts);
document.getElementById('filters').addEventListener('click',event=>{
  const button=event.target.closest('[data-filter]');if(!button)return;
  activeFilter=button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item=>item.classList.toggle('active',item===button));
  filterProducts();
});
document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('mainNav').classList.toggle('open'));
document.querySelectorAll('#mainNav a').forEach(link=>link.addEventListener('click',()=>document.getElementById('mainNav').classList.remove('open')));
renderCart();
