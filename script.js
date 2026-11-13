// غيّر كلمة المرور التجريبية من هنا قبل الاستخدام.
const ADMIN_PASSWORD = "DYNEXOR@2026";
const $ = (selector) => document.querySelector(selector);
const loginModal = $("#loginModal");
const adminPanel = $("#adminPanel");
const getRequests = () => JSON.parse(localStorage.getItem("dynexor_requests") || "[]");
const saveRequests = (items) => localStorage.setItem("dynexor_requests", JSON.stringify(items));

function openLogin(){ loginModal.classList.add("show"); loginModal.setAttribute("aria-hidden","false"); $("#adminPassword").focus(); }
function closeLogin(){ loginModal.classList.remove("show"); loginModal.setAttribute("aria-hidden","true"); $("#loginError").textContent=""; $("#loginForm").reset(); }
function openAdmin(){ closeLogin(); adminPanel.classList.add("show"); adminPanel.setAttribute("aria-hidden","false"); renderDashboard(); }
function closeAdmin(){ adminPanel.classList.remove("show"); adminPanel.setAttribute("aria-hidden","true"); }
document.querySelectorAll(".admin-open").forEach(btn=>btn.addEventListener("click",openLogin));
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",closeLogin));
$("#closeAdmin").addEventListener("click",closeAdmin);
$("#logoutBtn").addEventListener("click",closeAdmin);
$("#loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  if($("#adminPassword").value === ADMIN_PASSWORD){openAdmin();}
  else{$("#loginError").textContent="كلمة المرور غير صحيحة، حاول مرة أخرى.";}
});
$("#menuToggle").addEventListener("click",()=>$("#navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));

$("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  data.createdAt=new Date().toLocaleString("ar-EG");
  const requests=getRequests(); requests.unshift(data); saveRequests(requests);
  e.currentTarget.reset(); $("#formNote").textContent="تم حفظ طلبك بنجاح على هذا الجهاز. شكرًا لتواصلك!";
  renderDashboard();
});
function renderDashboard(){
  const requests=getRequests();
  $("#totalRequests").textContent=requests.length;
  $("#requestBadge").textContent=requests.length;
  const list=$("#requestsList");
  if(!requests.length){list.innerHTML='<div class="empty-state">لا توجد طلبات حتى الآن.</div>';return;}
  list.innerHTML=requests.map(item=>`<article class="request-item"><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(item.message)}</p><small>${escapeHTML(item.email)} · ${escapeHTML(item.createdAt)}</small></article>`).join("");
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));}
$("#clearRequests").addEventListener("click",()=>{
  if(confirm("هل أنت متأكد من مسح جميع الطلبات؟")){saveRequests([]);renderDashboard();}
});
$("#showRequests").addEventListener("click",()=>$("#requestsSection").scrollIntoView({behavior:"smooth"}));
$("#showSettings").addEventListener("click",()=>$("#settingsSection").scrollIntoView({behavior:"smooth"}));
renderDashboard();
