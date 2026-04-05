import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://otwcraewogbonfjnpxoe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d2NyYWV3b2dib25mam5weG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDY3NjEsImV4cCI6MjA4OTg4Mjc2MX0.6Gw7JACYTjVMDLWXBJU42c7I_CQ1Sb8PlzUR640vQcU'
);

document.getElementById('btn-login')
.addEventListener('click', async () => {

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert("Preencha email e senha");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    alert("Erro ao fazer login!");
    console.error(error);
    return;
  }

  // ✅ SALVA SESSÃO LOCAL (IMPORTANTE PRO DASHBOARD)
  localStorage.setItem("logado", "true");

  // 🔥 REDIRECIONA (COM / PARA NETLIFY)
  window.location.href = "/dashboard.html";
});