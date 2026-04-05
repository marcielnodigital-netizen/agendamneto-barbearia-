import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
    'https://otwcraewogbonfjnpxoe.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d2NyYWV3b2dib25mam5weG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDY3NjEsImV4cCI6MjA4OTg4Mjc2MX0.6Gw7JACYTjVMDLWXBJU42c7I_CQ1Sb8PlzUR640vQcU'
);

// 🔐 VERIFICAR LOGIN LOCAL
if (!localStorage.getItem("logado")) {
    window.location.href = "/login.html";
}

// 🔐 PEGAR USUÁRIO
const { data, error: userError } = await supabase.auth.getUser();

if (userError || !data.user) {
    console.log("Usuário não autenticado");
    localStorage.removeItem("logado");
    window.location.href = "/login.html";
}

const user = data.user;

// 👤 MOSTRAR USUÁRIO
document.getElementById("usuario-logado").innerText =
    "Logado como: " + user.email;

// 🔄 MONITORAR LOGIN
supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
        localStorage.removeItem("logado");
        window.location.href = "/login.html";
    }
});

// 🚪 LOGOUT
window.logout = async function () {
    await supabase.auth.signOut();
    localStorage.removeItem("logado");
    window.location.href = "/login.html";
}

// 📋 LISTA
const lista = document.getElementById("lista-agendamentos");

// 🚀 CARREGAR AGENDAMENTOS
async function carregarAgendamentos() {

    if (!lista) return;

    lista.innerHTML = "Carregando...";

    const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('barbeiro', user.email)
        .order('data', { ascending: true });

    if (error) {
        console.error(error);
        lista.innerHTML = "Erro ao carregar!";
        return;
    }

    if (!agendamentos || agendamentos.length === 0) {
        lista.innerHTML = "Nenhum agendamento encontrado.";
        return;
    }

    lista.innerHTML = "";

    agendamentos.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card-agendamento");

        div.innerHTML = `
            <p><strong>Nome:</strong> ${item.nome}</p>
            <p><strong>WhatsApp:</strong> ${item.whatsapp}</p>
            <p><strong>Serviço:</strong> ${item.servico}</p>
            <p><strong>Data:</strong> ${item.data}</p>
            <p><strong>Hora:</strong> ${item.hora}</p>
             <p><strong>Nome:</strong> ${item.nome}</p>
            <p><strong>WhatsApp:</strong> ${item.whatsapp}</p>
            <p><strong>Serviço:</strong> ${item.servico}</p>
            <p><strong>Data:</strong> ${item.data}</p>
            <p><strong>Hora:</strong> ${item.hora}</p>


            <button class="btn-excluir" data-id="${item.id}">
                🗑️ Excluir
            </button>
        `;

        lista.appendChild(div);
    });
}
 
// 🗑️ EXCLUIR
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-excluir")) {

        const id = e.target.getAttribute("data-id");

        if (!confirm("Deseja excluir este agendamento?")) return;

        const { error } = await supabase
  .from('agendamentos')
  .delete()
  .eq('id', id);

if (error) {
  console.error("Erro ao excluir:", error);
  alert("Erro ao excluir agendamento");
  return;
}

console.log("Excluído com sucesso");

        alert("Excluído com sucesso");
        carregarAgendamentos();
    }
});

// 🚀 INICIAR
carregarAgendamentos();