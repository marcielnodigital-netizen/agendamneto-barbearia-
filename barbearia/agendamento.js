// ✅ IMPORT DO SUPABASE
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://otwcraewogbonfjnpxoe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d2NyYWV3b2dib25mam5weG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDY3NjEsImV4cCI6MjA4OTg4Mjc2MX0.6Gw7JACYTjVMDLWXBJU42c7I_CQ1Sb8PlzUR640vQcU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let enviando = false;

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById('form-agendamento');

    if (!form) {
        console.log("Script ignorado");
        return;
    }

    // ⏰ GERAR HORÁRIOS
    function gerarHorarios() {
        const select = document.getElementById('hora_agendada');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione um horário</option>';

        for (let h = 9; h <= 18; h++) {
            for (let m = 0; m < 60; m += 10) {

                if (h === 18 && m > 0) break;

                const hora = String(h).padStart(2, '0');
                const minuto = String(m).padStart(2, '0');

                const valor = `${hora}:${minuto}`;

                const option = document.createElement('option');
                option.value = valor;
                option.textContent = valor;

                select.appendChild(option);
            }
        }
    }

    // 🚫 BLOQUEAR HORÁRIOS
    async function carregarHorariosOcupados() {
        const dataSelecionada = document.getElementById('data_agendada').value;
        if (!dataSelecionada) return;

        const { data, error } = await supabase
            .from('agendamentos')
            .select('hora')
            .eq('data', dataSelecionada);

        if (error) {
            console.error("Erro ao buscar horários:", error);
            return;
        }

        const horariosOcupados = data.map(item => item.hora);
        const selectHora = document.getElementById('hora_agendada');

        Array.from(selectHora.options).forEach(option => {
            if (!option.value) return;

            if (horariosOcupados.includes(option.value)) {
                option.disabled = true;
                option.textContent = option.value + " (Indisponível)";
            }
        });
    }

    // 🚀 ENVIO DO FORMULÁRIO
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (enviando) return;
        enviando = true;

        const botao = document.getElementById('btn-agendar');
        const textoOriginal = botao.innerText;

        botao.innerText = "Processando...";
        botao.disabled = true;

        try {
            const nome = document.getElementById('nome_cliente').value.trim();
            const barbeiro = document.getElementById('barbeiro').value;
            const whatsapp = document.getElementById('cliente_whatsapp').value;
            const servico = document.getElementById('servico').value;
            const data = document.getElementById('data_agendada').value;
            const hora = document.getElementById('hora_agendada').value;

            if (!nome || !servico || !data || !hora || !barbeiro) {
                alert("Preencha todos os campos obrigatórios");
                return;
            }

            const { data: result, error } = await supabase
                .from('agendamentos')
                .insert([{
                    nome,
                    whatsapp,
                    servico,
                    data,
                    hora,
                    barbeiro,
                    status: 'confirmado'
                }])
                .select();

            if (error) {
                if (error.code === "23505") {
                    alert("Esse horário já foi agendado.");
                } else {
                    console.error(error);
                    alert("Erro ao agendar.");
                }
                return;
            }

            // ✅ SUCESSO
            alert("Agendamento realizado com sucesso!");

            form.reset();
            gerarHorarios();

        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro inesperado");

        } finally {
            botao.innerText = textoOriginal;
            botao.disabled = false;
            enviando = false;
        }
    });

    // 🔹 EVENTOS
    document.getElementById('data_agendada')
        ?.addEventListener('change', () => {
            gerarHorarios();
            carregarHorariosOcupados();
        });

    // 🚀 INICIALIZAÇÃO
    gerarHorarios();
});