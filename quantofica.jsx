import { useState, useEffect } from "react";

/* ── helpers ─────────────────────────────────────── */
const fmt = (v) =>
  isNaN(v) || !isFinite(v)
    ? "R$ —"
    : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtPct = (v) =>
  isNaN(v) ? "—" : v.toFixed(2).replace(".", ",") + "%";

function pmt(pv, i, n) {
  if (i === 0) return pv / n;
  return (pv * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
}

function futureValue(pmt_, i, n) {
  if (i === 0) return pmt_ * n;
  return pmt_ * ((Math.pow(1 + i, n) - 1) / i);
}

const PRAZOS = [12, 18, 24, 30, 36, 42, 48, 60, 72];

/* ── hook ─────────────────────────────────────────── */
function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ── Banner ───────────────────────────────────────── */
function AdUnit({ slot, vertical }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
  }, []);
  return (
    <div style={{
      width: "100%",
      minHeight: vertical ? 300 : 72,
      overflow: "hidden",
      flexShrink: 0,
      display: "block",
    }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: vertical ? 300 : 72 }}
        data-ad-client="ca-pub-9764377464253220"
        data-ad-slot={slot}
        data-ad-format={vertical ? "vertical" : "horizontal"}
        data-full-width-responsive="false"
      />
    </div>
  );
}
function Field({ label, value, onChange, step = 1000, min = 0, prefix, suffix }) {
  const [localVal, setLocalVal] = useState(String(value));
  useEffect(() => { setLocalVal(String(value)); }, [value]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{
        fontSize: "0.6rem", color: "#5a6a9a",
        letterSpacing: "0.1em", textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
      }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: 10, color: "#4a5880",
            fontSize: "0.78rem", fontFamily: "'DM Mono', monospace", pointerEvents: "none",
          }}>{prefix}</span>
        )}
        <input
          type="number" value={localVal} step={step} min={min}
          onChange={(e) => {
            setLocalVal(e.target.value);
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed)) onChange(parsed);
          }}
          style={{
            width: "100%",
            padding: prefix ? "9px 10px 9px 26px" : suffix ? "9px 36px 9px 10px" : "9px 10px",
            background: "#0d1120", border: "1.5px solid #1e2840",
            borderRadius: 8, color: "#e2e8ff",
            fontSize: "0.88rem", fontWeight: 700,
            fontFamily: "'DM Mono', monospace", outline: "none",
            transition: "border-color 0.2s", minWidth: 0,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4a7cff")}
          onBlur={(e) => {
            if (isNaN(parseFloat(e.target.value))) setLocalVal(String(value));
            e.target.style.borderColor = "#1e2840";
          }}
        />
        {suffix && (
          <span style={{
            position: "absolute", right: 8, color: "#4a5880",
            fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", pointerEvents: "none",
            whiteSpace: "nowrap",
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

/* ── StatCard ─────────────────────────────────────── */
function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#0f1420,#131928)",
      border: "1.5px solid #1a2035", borderRadius: 12,
      padding: "12px 14px", flex: 1, minWidth: 0,
    }}>
      <div style={{
        fontSize: "0.58rem", color: "#4a5880", letterSpacing: "0.1em",
        textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 5,
      }}>{label}</div>
      <div style={{
        fontSize: "clamp(0.82rem, 2vw, 1rem)", fontWeight: 800,
        color: color || "#e2e8ff", fontFamily: "'DM Mono', monospace",
        letterSpacing: "-0.02em", wordBreak: "break-all",
      }}>{value}</div>
      {sub && <div style={{ fontSize: "0.58rem", color: "#3d4a6a", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

/* ── Row ──────────────────────────────────────────── */
function Row({ label, val, color, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: "0.7rem", color: "#4a5880", flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: "0.75rem", fontWeight: bold ? 700 : 500,
        color: color || "#8899cc", fontFamily: "'DM Mono', monospace",
        textAlign: "right",
      }}>{val}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════ */
export default function QuantoFica() {
  const width = useWidth();
  const isSmall = width < 700;
  const isMid = width < 1000;

  const [valorCarro, setValorCarro] = useState(90000);
  const [entrada, setEntrada] = useState(25000);
  const [semEntrada, setSemEntrada] = useState(false);
  const [jurosMes, setJurosMes] = useState(1.0);
  const [prazoSel, setPrazoSel] = useState(36);
  const [cdiAnual, setCdiAnual] = useState(10.5);
  const [desvalorizacaoAnual, setDesvalorizacaoAnual] = useState(15);
  const [ipvaAnual, setIpvaAnual] = useState(2.0);
  const [manutencaoMensal, setManutencaoMensal] = useState(400);
  const [aluguelMensal, setAluguelMensal] = useState(3600);

  // Entrada efetiva: zero se semEntrada, senão o valor digitado
  const entradaEfetiva = semEntrada ? 0 : Math.min(entrada, valorCarro);
  const saldo = Math.max(0, valorCarro - entradaEfetiva);
  const iFinanc = jurosMes / 100;
  const iCdi = Math.pow(1 + cdiAnual / 100, 1 / 12) - 1;
  const iDesv = Math.pow(1 - desvalorizacaoAnual / 100, 1 / 12) - 1;

  const PRAZOS_EXT = semEntrada ? [24, 36, 48, 60, 72, 84, 96] : PRAZOS;

  const dados = PRAZOS_EXT.map((n) => {
    const parcela = pmt(saldo, iFinanc, n);
    const totalFinanciado = parcela * n;
    const totalPago = totalFinanciado + entradaEfetiva;
    const juros = totalFinanciado - saldo;
    return { n, parcela, totalFinanciado, totalPago, juros };
  });

  // Garante que prazoSel seja válido para o modo atual
  const prazoSelEfetivo = dados.find(d => d.n === prazoSel) ? prazoSel
    : semEntrada ? 60 : 36;

  const dadosSel = dados.find((d) => d.n === prazoSelEfetivo) || dados[3];
  const parcela = dadosSel.parcela;

  // ── CENÁRIO A: FINANCIAR ──
  const ipvaMensal = (valorCarro * ipvaAnual / 100) / 12;
  const custoMensalFinanciamento = parcela + ipvaMensal + manutencaoMensal;
  const valorCarroFinal = valorCarro * Math.pow(1 + iDesv, prazoSelEfetivo);
  const patrimonioFinanciamento = valorCarroFinal;
  const totalDesembolsadoFinanc = dadosSel.totalPago + (ipvaMensal + manutencaoMensal) * prazoSelEfetivo;
  // Desvalorização total = quanto o carro perdeu de valor nominal
  const desvalorizacaoTotal = valorCarro - valorCarroFinal;
  // Custo real total = tudo que saiu do bolso MENOS o que sobrou de revenda
  // = total desembolsado - valor de revenda
  const custoRealTotal = totalDesembolsadoFinanc - valorCarroFinal;

  // ── CENÁRIO C: ALUGAR (motorista de app) ──
  // Total gasto em aluguel no mesmo período
  const totalAluguel = aluguelMensal * prazoSelEfetivo;
  // Diferença mensal: quanto sobra vs financiar (pode ser positivo ou negativo)
  const diferencaMensalAluguel = aluguelMensal - custoMensalFinanciamento;
  // Se aluguel > custo financiamento: a sobra mensal vai pro CDI
  // Se aluguel < custo financiamento: o motorista gasta menos alugando
  const economiaOuCustoExtra = aluguelMensal - custoMensalFinanciamento;
  // Saldo acumulado da diferença investida no CDI (se sobrar dinheiro alugando)
  const fvDiferencaAluguel = economiaOuCustoExtra > 0
    ? futureValue(economiaOuCustoExtra, iCdi, prazoSelEfetivo)
    : -futureValue(-economiaOuCustoExtra, iCdi, prazoSelEfetivo);
  // Custo real de alugar = total aluguel (sem patrimônio ao final)
  const custoRealAluguel = totalAluguel;

  // ── CENÁRIO B: INVESTIR ──
  // A entrada NÃO é investida — ela seria usada para dar entrada no carro.
  // No cenário B, a pessoa não compra o carro agora.
  // Ela investe o mesmo custo mensal que teria (parcela + IPVA + manutenção).
  // A entrada também fica investida, já que não foi gasta no carro.
  const fvEntradaInvestida = entradaEfetiva * Math.pow(1 + iCdi, prazoSelEfetivo);
  const fvAportesMensais = futureValue(custoMensalFinanciamento, iCdi, prazoSelEfetivo);
  const saldoInvestidor = fvEntradaInvestida + fvAportesMensais;

  // Quando o investidor consegue comprar o carro À VISTA?
  // Mês a mês: carro deprecia, investidor acumula entrada + aportes mensais
  let mesCompraAVista = null;
  let saldoMesAMes = [];
  for (let m = 1; m <= 120; m++) {
    const carroValor = valorCarro * Math.pow(1 + iDesv, m);
    const entradaAcum = entradaEfetiva * Math.pow(1 + iCdi, m);
    const aportesAcum = futureValue(custoMensalFinanciamento, iCdi, m);
    const saldoM = entradaAcum + aportesAcum;
    saldoMesAMes.push({ m, saldo: saldoM, carro: carroValor });
    if (mesCompraAVista === null && saldoM >= carroValor) {
      mesCompraAVista = m;
    }
  }

  const diferencaPatrimonio = saldoInvestidor - patrimonioFinanciamento;
  const carroNoMesCompra = mesCompraAVista ? valorCarro * Math.pow(1 + iDesv, mesCompraAVista) : null;
  const sobraAposCompra = mesCompraAVista
    ? (saldoMesAMes[mesCompraAVista - 1]?.saldo ?? 0) - (carroNoMesCompra ?? 0)
    : null;

  // ── VEREDICTO: FINANCIAR vs ALUGAR ──
  const patrimonioFinanciar = valorCarroFinal;
  const patrimonioAlugar = economiaOuCustoExtra > 0 ? fvDiferencaAluguel : 0;
  const vantagemAluguel = patrimonioFinanciar - patrimonioAlugar;
  const financiarVence = vantagemAluguel > 0;

  // Colunas da tabela — remove colunas em telas pequenas
  const colunas = isSmall
    ? ["Prazo", "Parcela", "Tot. Financ.", "Tot. c/ Entr.", "Juros", "%"]
    : ["Prazo", "Parcela Mensal", "Total Financiado", "Total c/ Entrada", "Juros Totais", "%"];
  return (
    <div style={{
      fontFamily: "'Sora','Segoe UI',sans-serif",
      background: "#080c17",
      minHeight: "100vh",
      color: "#c8d4f0",
      overflowX: "hidden",
      width: "100%",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #080c17; width: 100%; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0d1120; }
        ::-webkit-scrollbar-thumb { background: #1e2840; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0;transform:translateY(14px);} to {opacity:1;transform:translateY(0);} }
        .fade-up { animation: fadeUp 0.45s ease forwards; }
        .rh:hover { background: #0f1525 !important; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 0.4; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        borderBottom: "1px solid #111a2e",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 54,
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8,12,23,0.97)",
        backdropFilter: "blur(10px)",
        width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#logoGrad2)"/>
            <defs>
              <linearGradient id="logoGrad2" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#1a2840"/>
                <stop offset="100%" stopColor="#1e1040"/>
              </linearGradient>
              <linearGradient id="qGrad2" x1="19" y1="3" x2="31" y2="15">
                <stop offset="0%" stopColor="#4a7cff"/>
                <stop offset="100%" stopColor="#7b4fff"/>
              </linearGradient>
            </defs>
            <rect x="7" y="5" width="14" height="19" rx="2" fill="none" stroke="#4a7cff" strokeWidth="1.5"/>
            <rect x="9" y="7" width="10" height="5" rx="1" fill="#4a7cff" opacity="0.25"/>
            <text x="18" y="11.5" textAnchor="end" fontSize="4" fill="#60b8ff" fontFamily="monospace" fontWeight="bold">R$</text>
            <rect x="9" y="14" width="3" height="2.5" rx="0.5" fill="#7b4fff" opacity="0.8"/>
            <rect x="13" y="14" width="3" height="2.5" rx="0.5" fill="#7b4fff" opacity="0.8"/>
            <rect x="17" y="14" width="3" height="2.5" rx="0.5" fill="#4a7cff" opacity="0.8"/>
            <rect x="9" y="17.5" width="3" height="2.5" rx="0.5" fill="#7b4fff" opacity="0.8"/>
            <rect x="13" y="17.5" width="3" height="2.5" rx="0.5" fill="#7b4fff" opacity="0.8"/>
            <rect x="17" y="17.5" width="3" height="2.5" rx="0.5" fill="#4a7cff" opacity="0.8"/>
            <rect x="9" y="21" width="3" height="2.5" rx="0.5" fill="#7b4fff" opacity="0.8"/>
            <rect x="13" y="21" width="3" height="2.5" rx="0.5" fill="#7b4fff" opacity="0.8"/>
            <rect x="17" y="21" width="5" height="2.5" rx="0.5" fill="#22c55e" opacity="0.9"/>
            <circle cx="25" cy="9" r="6" fill="url(#qGrad2)"/>
            <text x="25" y="12.5" textAnchor="middle" fontSize="8" fill="white" fontFamily="serif" fontWeight="bold">?</text>
          </svg>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.15rem", color:"#fff", letterSpacing:"-0.04em" }}>quanto</span>
            <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.15rem", background:"linear-gradient(90deg,#4a7cff,#7b4fff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.04em" }}>fica?</span>
            <span style={{ marginLeft:4, background:"#1a2840", color:"#4a7cff", fontSize:"0.5rem", fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", padding:"2px 6px", borderRadius:4, fontWeight:500 }}>BETA</span>
          </div>
        </div>
        {!isSmall && (
          <nav style={{ display:"flex", gap:14, fontSize:"0.72rem", color:"#4a5880", alignItems:"center" }}>
            <span style={{ cursor:"pointer" }}>Financiamento</span>
            <span style={{ cursor:"pointer" }}>CDI</span>
            <a href="movebrasil-blog" style={{ display:"flex", alignItems:"center", gap:5, background:"linear-gradient(135deg,#1a1030,#1e1840)", border:"1px solid #3d2a6a", borderRadius:8, padding:"5px 12px", textDecoration:"none", color:"#c084fc", fontSize:"0.68rem", fontWeight:700, fontFamily:"'DM Mono',monospace", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
              📋 Entender o Move Brasil
            </a>
          </nav>
        )}
      </header>

      {/* ── BANNER TOPO ── */}
      <div style={{ padding:"12px 16px 0" }}>
        <AdUnit slot="6038065393" />
      </div>

      {/* ── HERO ── */}
      <div style={{ textAlign:"center", padding: isSmall ? "20px 16px 16px" : "28px 24px 20px" }}>
        <h1 className="fade-up" style={{
          fontSize:"clamp(1.3rem,4vw,2.2rem)", fontWeight:800,
          letterSpacing:"-0.04em", color:"#fff", lineHeight:1.15,
        }}>
          Simule seu financiamento{" "}
          <span style={{ background:"linear-gradient(90deg,#4a7cff,#7b4fff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            em segundos.
          </span>
        </h1>
        <p style={{ color:"#4a5880", fontSize:"0.75rem", marginTop:8, fontFamily:"'DM Mono',monospace" }}>
          Tabela Price · Custo de Oportunidade · CDI vs Financiamento
        </p>
      </div>

      {/* ── CHAMADA BLOG MOVE BRASIL ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: isSmall ? "0 12px 8px" : "0 16px 8px" }}>
        <a href="movebrasil-blog" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 14, flexWrap: "wrap",
          background: "linear-gradient(135deg,#1a1030,#1a0e38)",
          border: "1.5px solid #3d2a6a", borderRadius: 12,
          padding: "14px 20px", textDecoration: "none",
          transition: "border-color 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#7b4fff"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#3d2a6a"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.5rem" }}>🇧🇷</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#e2e8ff" }}>Programa Move Brasil</div>
              <div style={{ fontSize: "0.65rem", color: "#8060cc", fontFamily: "'DM Mono',monospace", marginTop: 2 }}>
                Saiba tudo sobre o programa · quem pode · como se inscrever · carros elegíveis
              </div>
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#c084fc", fontWeight: 700, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>
            Ler o guia completo →
          </span>
        </a>
      </div>

      {/* ── LAYOUT PRINCIPAL ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMid ? "1fr" : "140px 1fr 140px",
        gap: 16,
        padding: isSmall ? "0 12px 32px" : "0 16px 40px",
        maxWidth: 1240,
        margin: "0 auto",
        width: "100%",
        alignItems: "flex-start",
      }}>

        {/* Banner lateral esquerdo — só em telas grandes */}
        {!isMid && <AdUnit slot="4724983721" vertical />}

        {/* ── CONTEÚDO CENTRAL ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:20, minWidth:0 }}>

          {/* SEÇÃO FINANCIAMENTO */}
          <section className="fade-up" style={{
            background:"linear-gradient(135deg,#0d1120,#0f1428)",
            border:"1.5px solid #1a2035", borderRadius:16,
            padding: isSmall ? "16px 14px" : "22px",
            boxShadow:"0 4px 40px rgba(0,0,0,0.4)",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:30, height:30, background:"linear-gradient(135deg,#1a2840,#1e3060)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>🚗</div>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.9rem", color:"#e2e8ff" }}>Simulador de Financiamento</div>
                <div style={{ fontSize:"0.58rem", color:"#3d4a6a", fontFamily:"'DM Mono',monospace" }}>TABELA PRICE · PARCELAS FIXAS</div>
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display:"grid", gridTemplateColumns: isSmall ? "1fr 1fr" : "repeat(3,1fr)", gap:12, marginBottom:14 }}>
              <Field label="Valor do veículo" value={valorCarro} onChange={setValorCarro} step={1000} prefix="R$" />
              <div style={{ opacity: semEntrada ? 0.35 : 1, pointerEvents: semEntrada ? "none" : "auto", gridColumn: semEntrada ? "span 1" : "auto" }}>
                <Field label="Entrada" value={entrada} onChange={setEntrada} step={1000} prefix="R$" />
              </div>
              <div style={{ gridColumn: isSmall ? "1 / -1" : "auto" }}>
                <Field label="Juros ao mês" value={jurosMes} onChange={setJurosMes} step={0.05} min={0.1} suffix="% a.m." />
              </div>
            </div>

            {/* Toggle sem entrada */}
            <div
              onClick={() => { setSemEntrada(v => !v); setPrazoSel(semEntrada ? 36 : 60); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                cursor: "pointer", marginBottom: 16, userSelect: "none",
                padding: "8px 14px",
                background: semEntrada ? "linear-gradient(135deg,#1a2e10,#1e3a14)" : "#0d1120",
                border: `1.5px solid ${semEntrada ? "#3a7a20" : "#1e2840"}`,
                borderRadius: 8, transition: "all 0.2s",
              }}
            >
              {/* pill toggle */}
              <div style={{ width: 36, height: 20, borderRadius: 10, background: semEntrada ? "#4ade80" : "#1e2840", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: semEntrada ? 18 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: semEntrada ? "#86efac" : "#8899cc" }}>
                  {semEntrada ? "✓ Sem entrada — financiamento integral" : "Financiar sem entrada?"}
                </div>
                <div style={{ fontSize: "0.6rem", color: "#4a5880", fontFamily: "'DM Mono',monospace" }}>
                  {semEntrada ? `Saldo: ${fmt(saldo)} · prazos ampliados até 96 meses` : "Clique para financiar 100% do veículo"}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
              <StatCard label="Saldo financiado" value={fmt(saldo)} color="#4a7cff" />
              <StatCard label="Taxa ao ano" value={fmtPct(jurosMes * 12)} color="#7b4fff" />
              {!isSmall && <StatCard label={`Entrada ${semEntrada ? "(sem entrada)" : ""}`} value={semEntrada ? "R$ 0" : fmt(entradaEfetiva)} color={semEntrada ? "#4ade80" : "#f0c840"} sub="clique na linha p/ selecionar prazo" />}
            </div>

            {/* Tabela */}
            <div style={{ overflowX:"auto", borderRadius:10, border:"1px solid #111a2e" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize: isSmall ? "0.66rem" : "0.78rem", minWidth: 480 }}>
                <thead>
                  <tr style={{ background:"#0a0e1a" }}>
                    {colunas.map((h, i) => (
                      <th key={h} style={{
                        padding: isSmall ? "8px 10px" : "10px 13px",
                        textAlign: i===0 ? "left" : "right",
                        color:"#3d4a6a", fontSize:"0.58rem",
                        textTransform:"uppercase", letterSpacing:"0.07em",
                        fontFamily:"'DM Mono',monospace", fontWeight:500,
                        borderBottom:"1px solid #111a2e", whiteSpace:"nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dados.map((d) => {
                    const sel = d.n === prazoSelEfetivo;
                    const pct = saldo > 0 ? (d.juros / saldo) * 100 : 0;
                    return (
                      <tr key={d.n} className="rh"
                        onClick={() => setPrazoSel(d.n)}
                        style={{
                          background: sel ? "#0d1830" : "transparent",
                          borderLeft: sel ? "3px solid #4a7cff" : "3px solid transparent",
                          borderBottom:"1px solid #0d1120",
                          cursor:"pointer", transition:"all 0.15s",
                        }}
                      >
                        <td style={{ padding: isSmall ? "6px 7px" : "9px 13px", color:"#e2e8ff", fontWeight:700, fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>
                          {d.n}m {sel && <span style={{ background:"#1a2e50", color:"#4a7cff", borderRadius:3, fontSize:"0.55rem", padding:"1px 5px" }}>✓</span>}
                        </td>
                        <td style={{ padding: isSmall ? "6px 7px" : "9px 13px", textAlign:"right", color:"#60b8ff", fontWeight:700, fontFamily:"'DM Mono',monospace" }}>{fmt(d.parcela)}</td>
                        <td style={{ padding: isSmall ? "6px 7px" : "9px 13px", textAlign:"right", color:"#8899cc", fontFamily:"'DM Mono',monospace" }}>{fmt(d.totalFinanciado)}</td>
                        <td style={{ padding: isSmall ? "6px 7px" : "9px 13px", textAlign:"right", color:"#f0c840", fontWeight:600, fontFamily:"'DM Mono',monospace" }}>{fmt(d.totalPago)}</td>
                        <td style={{ padding: isSmall ? "6px 7px" : "9px 13px", textAlign:"right", color:"#ff6b6b", fontFamily:"'DM Mono',monospace" }}>{fmt(d.juros)}</td>
                        <td style={{ padding: isSmall ? "6px 7px" : "9px 13px", textAlign:"right", color: pct>40?"#ff6b6b":"#ff9966", fontFamily:"'DM Mono',monospace" }}>{pct.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop:8, fontSize:"0.6rem", color:"#2d3a5a", fontFamily:"'DM Mono',monospace" }}>
              Clique em uma linha para usar na comparação CDI abaixo.
            </p>
          </section>


          {/* CTA FINANCIAMENTO */}
          <section style={{ background:"linear-gradient(135deg,#0f1d3a 0%,#1a2d50 50%,#0d1b35 100%)", border:"1px solid #1e3a6e", borderRadius:16, padding:"24px 28px", marginTop:8, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, background:"radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)", pointerEvents:"none" }} />
            <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:16 }}>
              <span style={{ fontSize:"1.6rem" }}>&#x1F697;</span>
              <div>
                <p style={{ color:"#93c5fd", fontSize:"0.65rem", fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Pr�ximo passo</p>
                <h3 style={{ color:"#fff", fontSize:"1.1rem", fontWeight:700, margin:0 }}>Pronto para financiar?</h3>
              </div>
            </div>
            <div style={{ background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:8, padding:"8px 12px", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              <span>&#x23F3;</span>
              <p style={{ color:"#fbbf24", fontSize:"0.75rem", fontFamily:"'DM Mono',monospace", margin:0 }}>Inscricoes Move Brasil abrem em <strong>19 de junho de 2026</strong></p>
            </div>
            <p style={{ color:"#94a3b8", fontSize:"0.82rem", lineHeight:1.5, marginBottom:20 }}>Use os valores desta simulacao para se inscrever no programa oficial. Taxas subsidiadas de ate <strong style={{ color:"#4ade80" }}>1,09% a.m.</strong> para motoristas de app e taxistas.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <a href={"https://www.gov.br/mdic/pt-br/assuntos/sdic/move-brasil?utm_source=simuladorquantofica&utm_medium=cta_simulacao&utm_campaign=move_brasil_2026"} target="_blank" rel="noopener noreferrer" style={{ display:"block", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", textDecoration:"none", textAlign:"center", padding:"14px 20px", borderRadius:10, fontFamily:"'DM Mono',monospace", fontSize:"0.82rem", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", border:"1px solid #3b82f6" }}>
                Acessar Move Brasil oficial
              </a>
              <a href={"https://www.bv.com.br/financiamento/financiamento-de-veiculos?utm_source=simuladorquantofica&utm_medium=cta_simulacao&utm_campaign=bv_auto_2026"} target="_blank" rel="noopener noreferrer" style={{ display:"block", background:"transparent", color:"#93c5fd", textDecoration:"none", textAlign:"center", padding:"12px 20px", borderRadius:10, fontFamily:"'DM Mono',monospace", fontSize:"0.78rem", fontWeight:600, border:"1px solid #1e3a6e" }}>
                Simular tambem no BV Banco
              </a>
            </div>
          </section>

          {/* BANNER MEIO */}
          <AdUnit slot="6038065393" />

          {/* SEÇÃO CDI */}
          <section className="fade-up" style={{
            background:"linear-gradient(135deg,#0d1120,#0f1428)",
            border:"1.5px solid #1a2035", borderRadius:16,
            padding: isSmall ? "16px 14px" : "22px",
            boxShadow:"0 4px 40px rgba(0,0,0,0.4)",
          }}>
            {/* Título */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <div style={{ width:30, height:30, background:"linear-gradient(135deg,#1a3020,#1e4030)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>📊</div>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.9rem", color:"#e2e8ff" }}>Financiar vs Investir — Comparação Real</div>
                <div style={{ fontSize:"0.58rem", color:"#3d4a6a", fontFamily:"'DM Mono',monospace" }}>E SE VOCÊ INVESTISSE EM VEZ DE COMPRAR O CARRO?</div>
              </div>
            </div>
            <p style={{ fontSize:"0.72rem", color:"#4a5880", marginBottom:18, paddingLeft: isSmall ? 0 : 40 }}>
              Usando prazo de <strong style={{ color:"#60b8ff" }}>{prazoSelEfetivo} meses</strong> · parcela de <strong style={{ color:"#60b8ff" }}>{fmt(parcela)}</strong> · custo total mensal de <strong style={{ color:"#f0c840" }}>{fmt(custoMensalFinanciamento)}</strong>
            </p>

            {/* Inputs */}
            <div style={{ display:"grid", gridTemplateColumns: isSmall ? "1fr 1fr" : "repeat(5,1fr)", gap:12, marginBottom:20 }}>
              <Field label="CDI ao ano" value={cdiAnual} onChange={setCdiAnual} step={0.25} min={0.1} suffix="% a.a." />
              <Field label="Desvalorização do carro" value={desvalorizacaoAnual} onChange={setDesvalorizacaoAnual} step={1} min={0} suffix="% a.a." />
              <Field label="IPVA ao ano" value={ipvaAnual} onChange={setIpvaAnual} step={0.1} min={0} suffix="%" />
              <Field label="Manutenção/mês" value={manutencaoMensal} onChange={setManutencaoMensal} step={50} min={0} prefix="R$" />
              <Field label="Aluguel do carro/mês (~R$800-1000/sem)" value={aluguelMensal} onChange={setAluguelMensal} step={100} min={0} prefix="R$" />
            </div>

            {/* Cards cenários */}
            <div style={{ display:"grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap:14, marginBottom:16 }}>

              {/* Cenário A: Financiar */}
              <div style={{ background:"linear-gradient(135deg,#1a0a0a,#200d0d)", border:"1.5px solid #3a1515", borderRadius:12, padding:16 }}>
                <div style={{ fontSize:"0.58rem", color:"#7a3535", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>🚗 Cenário A — Financiar ({prazoSelEfetivo}m)</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  <Row label="Parcela mensal" val={fmt(parcela)} color="#ff8888" />
                  <Row label="IPVA rateado/mês" val={fmt(ipvaMensal)} color="#ffaa88" />
                  <Row label="Manutenção/mês" val={fmt(manutencaoMensal)} color="#ffaa88" />
                  <div style={{ borderTop:"1px solid #2a1515", paddingTop:7, display:"flex", flexDirection:"column", gap:7 }}>
                    <Row label="Custo mensal total" val={fmt(custoMensalFinanciamento)} color="#ff6b6b" bold />
                    <Row label="Total desembolsado" val={fmt(totalDesembolsadoFinanc)} color="#ff4444" bold />
                    <Row label={`Valor do carro ao final (−${desvalorizacaoAnual}% a.a.)`} val={fmt(valorCarroFinal)} color="#f87171" />
                    <Row label="Desvalorização total" val={`− ${fmt(desvalorizacaoTotal)}`} color="#ff4444" />
                  </div>
                  <div style={{ borderTop:"1px solid #2a1515", paddingTop:7, display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ background:"#200808", borderRadius:6, padding:"8px 10px" }}>
                      <div style={{ fontSize:"0.55rem", color:"#7a3535", fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em", marginBottom:3 }}>🔴 CUSTO REAL TOTAL (DESEMBOLSO + DESVALORIZAÇÃO)</div>
                      <div style={{ fontSize:"1.05rem", fontWeight:800, color:"#ff2222", fontFamily:"'DM Mono',monospace" }}>{fmt(totalDesembolsadoFinanc + desvalorizacaoTotal)}</div>
                      <div style={{ fontSize:"0.55rem", color:"#5a2a2a", marginTop:2 }}>= tudo que você pagou + o que o carro perdeu de valor</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Cenário B: Investir */}
              <div style={{ background:"linear-gradient(135deg,#0a1a0e,#0d2010)", border:"1.5px solid #153a1a", borderRadius:12, padding:16 }}>
                <div style={{ fontSize:"0.58rem", color:"#357a45", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>📈 Cenário B — Investir no CDI</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  <Row label="Aporte mensal (mesmo custo)" val={fmt(custoMensalFinanciamento)} color="#88ff99" />
                  <Row label="Entrada também investida" val={fmt(entrada)} color="#88ff99" />
                  <Row label="CDI ao mês (aprox.)" val={fmtPct(iCdi * 100)} />
                  <div style={{ borderTop:"1px solid #152a1a", paddingTop:7, display:"flex", flexDirection:"column", gap:7 }}>
                    <Row label={`Entrada + juros (${prazoSelEfetivo}m)`} val={fmt(fvEntradaInvestida)} color="#4ade80" />
                    <Row label="Aportes mensais acumulados" val={fmt(fvAportesMensais - custoMensalFinanciamento * prazoSelEfetivo)} color="#4ade80" />
                    <Row label="Saldo total acumulado" val={fmt(saldoInvestidor)} color="#22c55e" bold />
                  </div>
                  <div style={{ borderTop:"1px solid #152a1a", paddingTop:7 }}>
                    <Row label="Patrimônio ao final" val={fmt(saldoInvestidor)} color="#86efac" bold />
                    <div style={{ fontSize:"0.6rem", color:"#1a4a20", marginTop:4 }}>= dinheiro em conta (pode comprar carro à vista)</div>
                    <div style={{ marginTop:8, background:"#081a0c", borderRadius:6, padding:"7px 10px" }}>
                      <div style={{ fontSize:"0.58rem", color:"#357a45", fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em", marginBottom:3 }}>RENDIMENTO MENSAL DO SALDO (12% CDI/MÊS)</div>
                      <div style={{ fontSize:"0.92rem", fontWeight:800, color:"#4ade80", fontFamily:"'DM Mono',monospace" }}>
                        {fmt(saldoInvestidor * iCdi)} <span style={{ fontSize:"0.6rem", fontWeight:400, color:"#357a45" }}>/mês</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultado principal: quando compra à vista */}
            <div style={{
              background: mesCompraAVista && mesCompraAVista <= prazoSelEfetivo
                ? "linear-gradient(135deg,#0a1a0e,#0d2010)"
                : "linear-gradient(135deg,#0f1a0a,#131e0d)",
              border: "1.5px solid #1e4a20",
              borderRadius:12, padding:"18px 20px", marginBottom:14,
            }}>
              <div style={{ fontSize:"0.58rem", color:"#357a45", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
                🗓️ Quando o investidor pode comprar o carro à vista?
              </div>
              {mesCompraAVista ? (
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                  <div>
                    <div style={{ fontSize:"clamp(1.4rem,3vw,1.8rem)", fontWeight:800, color:"#4ade80", fontFamily:"'DM Mono',monospace", letterSpacing:"-0.03em" }}>
                      {mesCompraAVista} meses
                    </div>
                    <div style={{ fontSize:"0.72rem", color:"#6aaa80", marginTop:4 }}>
                      {mesCompraAVista <= prazoSelEfetivo
                        ? `✅ Antes do fim do financiamento (${prazoSelEfetivo}m) — e ainda sobram ${fmt(sobraAposCompra ?? 0)}`
                        : `⏳ ${mesCompraAVista - prazoSelEfetivo} meses depois do fim do financiamento`}
                    </div>
                    <div style={{ fontSize:"0.66rem", color:"#3d6a4a", marginTop:6 }}>
                      Carro valerá nesse momento: {fmt(carroNoMesCompra ?? 0)} · Saldo do investidor: {fmt(saldoMesAMes[mesCompraAVista - 1]?.saldo ?? 0)}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"0.6rem", color:"#357a45", fontFamily:"'DM Mono',monospace", marginBottom:4 }}>SOBRA APÓS COMPRAR</div>
                    <div style={{ fontSize:"1.1rem", fontWeight:800, color:"#22c55e", fontFamily:"'DM Mono',monospace" }}>{fmt(sobraAposCompra ?? 0)}</div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize:"0.82rem", color:"#6aaa80" }}>
                  Com os parâmetros atuais, o investidor não alcança o preço do carro em 10 anos. Tente aumentar o CDI ou reduzir a desvalorização.
                </div>
              )}
            </div>

            {/* Diferença de patrimônio */}
            <div style={{
              background: diferencaPatrimonio > 0 ? "linear-gradient(135deg,#0a1a0e,#0d2010)" : "linear-gradient(135deg,#1a0a0a,#200d0d)",
              border: `1.5px solid ${diferencaPatrimonio > 0 ? "#153a1a" : "#3a1515"}`,
              borderRadius:12, padding:"16px 18px",
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12,
            }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:"0.58rem", color:"#4a5880", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>
                  Diferença de patrimônio ao final de {prazoSelEfetivo} meses
                </div>
                <div style={{ fontSize:"0.75rem", color: diferencaPatrimonio > 0 ? "#86efac" : "#fca5a5", fontWeight:600, marginBottom:10 }}>
                  {diferencaPatrimonio > 0
                    ? `Investindo, você termina ${fmt(diferencaPatrimonio)} mais rico — com dinheiro em conta vs um carro depreciado.`
                    : `Financiando, você termina com o carro valendo ${fmt(Math.abs(diferencaPatrimonio))} a mais do que teria em conta.`}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <div style={{ background:"#080c17", border:"1px solid #1e2840", borderRadius:8, padding:"8px 12px", minWidth:130 }}>
                    <div style={{ fontSize:"0.55rem", color:"#4a5880", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:3 }}>RENDA MENSAL — INVESTINDO</div>
                    <div style={{ fontSize:"0.9rem", fontWeight:800, color:"#4ade80", fontFamily:"'DM Mono',monospace" }}>{fmt(saldoInvestidor * iCdi)}<span style={{ fontSize:"0.58rem", color:"#357a45", fontWeight:400 }}>/mês</span></div>
                  </div>
                  <div style={{ background:"#080c17", border:"1px solid #1e2840", borderRadius:8, padding:"8px 12px", minWidth:130 }}>
                    <div style={{ fontSize:"0.55rem", color:"#4a5880", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:3 }}>CUSTO MENSAL REAL (DESEMBOLSO + DESVALORIZAÇÃO)</div>
                    <div style={{ fontSize:"0.9rem", fontWeight:800, color:"#fca5a5", fontFamily:"'DM Mono',monospace" }}>{fmt((totalDesembolsadoFinanc + desvalorizacaoTotal) / prazoSelEfetivo)}<span style={{ fontSize:"0.58rem", color:"#7a3535", fontWeight:400 }}>/mês</span></div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:"clamp(1.2rem,3vw,1.5rem)", fontWeight:800, fontFamily:"'DM Mono',monospace", color: diferencaPatrimonio > 0 ? "#4ade80" : "#ff6b6b", letterSpacing:"-0.03em" }}>
                  {diferencaPatrimonio > 0 ? "+" : ""}{fmt(diferencaPatrimonio)}
                </div>
                <div style={{ fontSize:"0.6rem", color:"#4a5880", marginTop:2 }}>
                  {diferencaPatrimonio > 0 ? "a favor de investir" : "a favor de financiar"}
                </div>
              </div>
            </div>

            {/* ── COMPARATIVO: FINANCIAR vs ALUGAR 5 ANOS ── */}
            <div style={{
              background:"linear-gradient(135deg,#0d0f1a,#10122a)",
              border:"1.5px solid #2a2a50", borderRadius:12, padding:"18px 20px", marginBottom:14,
            }}>
              <div style={{ fontSize:"0.58rem", color:"#6060aa", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>
                🚖 Financiar vs Alugar — 5 anos de uso
              </div>
              <div style={{ display:"grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap:12, marginBottom:14 }}>
                {/* Total financiado */}
                <div style={{ background:"#1a0a0a", border:"1px solid #3a1515", borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:"0.55rem", color:"#7a3535", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:8 }}>🚗 TOTAL VALOR FINANCIADO ({prazoSelEfetivo} MESES)</div>
                  <div style={{ fontSize:"1.3rem", fontWeight:800, color:"#ff8888", fontFamily:"'DM Mono',monospace" }}>{fmt(dadosSel.totalPago)}</div>
                  <div style={{ fontSize:"0.6rem", color:"#5a2a2a", marginTop:6, lineHeight:1.6 }}>
                    entrada {fmt(entradaEfetiva)} + parcelas {fmt(dadosSel.totalFinanciado)}<br/>
                    ao fim: carro vale ~{fmt(valorCarroFinal)}
                  </div>
                </div>
                {/* Total alugado 5 anos */}
                <div style={{ background:"#0a0a1a", border:"1px solid #2a2a50", borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:"0.55rem", color:"#6060aa", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:8 }}>🏠 TOTAL VALOR ALUGADO (5 ANOS / 60 MESES)</div>
                  <div style={{ fontSize:"1.3rem", fontWeight:800, color:"#a0a0ff", fontFamily:"'DM Mono',monospace" }}>{fmt(aluguelMensal * 60)}</div>
                  <div style={{ fontSize:"0.6rem", color:"#3a3a6a", marginTop:6, lineHeight:1.6 }}>
                    {fmt(aluguelMensal)}/mês × 60 meses<br/>
                    sem patrimônio ao final
                  </div>
                </div>
              </div>
              {/* Diferença */}
              {(() => {
                const totalFinanc = dadosSel.totalPago;
                const totalAlug = aluguelMensal * 60;
                const diff = Math.abs(totalFinanc - totalAlug);
                const aluguelMaisCaro = totalAlug > totalFinanc;
                return (
                  <div style={{
                    background: aluguelMaisCaro ? "linear-gradient(135deg,#0a1a0e,#0d2010)" : "linear-gradient(135deg,#0a0a1a,#10102a)",
                    border: `1px solid ${aluguelMaisCaro ? "#153a1a" : "#2a2a50"}`,
                    borderRadius:10, padding:"12px 16px",
                    display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10,
                  }}>
                    <div>
                      <div style={{ fontSize:"0.6rem", color:"#4a5880", fontFamily:"'DM Mono',monospace", marginBottom:4 }}>
                        DIFERENÇA TOTAL EM 5 ANOS DE USO
                      </div>
                      <div style={{ fontSize:"0.75rem", color: aluguelMaisCaro ? "#86efac" : "#a0a0ff", fontWeight:600 }}>
                        {aluguelMaisCaro
                          ? `Financiar custa ${fmt(diff)} menos que alugar por 5 anos — e você ainda fica com o carro`
                          : `Alugar custa ${fmt(diff)} menos que financiar — mas sem patrimônio ao final`}
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:"clamp(1rem,2.5vw,1.3rem)", fontWeight:800, color: aluguelMaisCaro ? "#4ade80" : "#a0a0ff", fontFamily:"'DM Mono',monospace" }}>
                        {fmt(diff)}
                      </div>
                      <div style={{ fontSize:"0.58rem", color:"#4a5880", marginTop:2 }}>
                        {aluguelMaisCaro ? "financiamento mais barato" : "aluguel mais barato"}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ marginTop:14, padding:12, background:"#080c17", border:"1px solid #111a2e", borderRadius:8, fontSize:"0.62rem", color:"#3d4a6a", lineHeight:1.7, fontFamily:"'DM Mono',monospace" }}>
              💡 <strong style={{color:"#5a6a80"}}>Como funciona:</strong> o Cenário B investe o mesmo valor mensal (parcela + IPVA + manutenção) no CDI. O carro deprecia {desvalorizacaoAnual}% ao ano. Aluguel de carro para app custa em média R$ 800–1.000/semana (R$ 3.200–4.000/mês) em locadoras como Kovi e Localiza Zarp — geralmente mais caro que a parcela do financiamento. CDI sem IR (15–22,5%).
            </div>
          </section>

          {/* BANNER RODAPÉ */}
          <AdUnit slot="6038065393" />
        </div>

        {/* Banner lateral direito — só em telas grandes */}
        {!isMid && <AdUnit slot="4724983721" vertical />}
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop:"1px solid #111a2e",
        background:"#060810",
        padding:"28px clamp(12px,4vw,40px) 20px",
        fontFamily:"'DM Mono',monospace",
      }}>
        <div style={{ maxWidth:1240, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 }}>

          {/* Logo + descrição */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ display:"flex", alignItems:"baseline", gap:5, marginBottom:6 }}>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1rem", color:"#fff" }}>quanto</span>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1rem", background:"linear-gradient(90deg,#4a7cff,#7b4fff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>fica?</span>
              </div>
              <div style={{ fontSize:"0.65rem", color:"#4a5880", lineHeight:1.6, maxWidth:320 }}>
                Simulador financeiro educacional. Valores são estimativas e não constituem aconselhamento financeiro. Consulte sempre um profissional habilitado.
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:"0.62rem", color:"#3d4a6a", lineHeight:1.8 }}>
                <div>📧 suporte@simuladorquantofica.com.br</div>
                <div>🌐 simuladorquantofica.com.br</div>
              </div>
            </div>
          </div>

          {/* Linha divisória */}
          <div style={{ height:1, background:"linear-gradient(90deg,transparent,#1e2840,transparent)" }} />

          {/* Aviso legal */}
          <div style={{ background:"linear-gradient(135deg,#0d1120,#0a0e1a)", border:"1px solid #1e2840", borderRadius:10, padding:"14px 18px" }}>
            <div style={{ fontSize:"0.6rem", color:"#4a7cff", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8, fontWeight:600 }}>
              ⚖️ Propriedade Intelectual & Direitos Autorais
            </div>
            <p style={{ fontSize:"0.68rem", color:"#5a6a8a", lineHeight:1.8, margin:0 }}>
              <strong style={{color:"#8899cc"}}>quanto fica?</strong> é uma marca em processo de registro no INPI — Instituto Nacional da Propriedade Industrial (Classes 36 e 42). O nome, logotipo, design, código-fonte, layouts, textos, simuladores e demais elementos desta plataforma são protegidos pelas Leis nº 9.279/1996 (Propriedade Industrial), nº 9.610/1998 (Direitos Autorais) e nº 9.609/1998 (Software), sendo de titularidade exclusiva de seus criadores.{" "}
              <strong style={{color:"#ff6b6b"}}>É expressamente proibida a reprodução, cópia, distribuição, modificação ou uso comercial de qualquer elemento desta plataforma sem autorização prévia e por escrito.</strong>{" "}
              Casos de plágio, cópia não autorizada ou uso indevido da marca serão tratados judicialmente, podendo acarretar indenização por danos materiais e morais, nos termos da legislação vigente.
            </p>
          </div>

          {/* Copyright bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, fontSize:"0.6rem", color:"#2d3a5a" }}>
            <span>© {new Date().getFullYear()} quanto fica? — Todos os direitos reservados.</span>
            <span>™ Marca em registro · INPI Classes 36 e 42</span>
          </div>

        </div>
      </footer>

      {/* COOKIE BANNER */}
      <CookieBanner />
    </div>
  );
}

/* ── Cookie Banner ─────────────────────────────── */
function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem("qf_cookies_accepted"); }
    catch { return true; }
  });
  const [showDetails, setShowDetails] = useState(false);

  const accept = (all) => {
    try { localStorage.setItem("qf_cookies_accepted", all ? "all" : "essential"); }
    catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
      background: "linear-gradient(135deg,#0d1120ee,#0f1428ee)",
      backdropFilter: "blur(16px)",
      borderTop: "1.5px solid #1e2840",
      padding: "16px clamp(12px,4vw,40px)",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
        {/* Ícone + texto */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: "1.1rem" }}>🍪</span>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#e2e8ff", fontFamily: "'Sora',sans-serif" }}>
              Usamos cookies
            </span>
          </div>
          <p style={{ fontSize: "0.72rem", color: "#7a8ab0", lineHeight: 1.6, margin: 0 }}>
            Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência.
            Nenhum dado é vendido a terceiros.{" "}
            <button onClick={() => setShowDetails(v => !v)} style={{ background: "none", border: "none", color: "#4a7cff", cursor: "pointer", fontSize: "0.72rem", padding: 0, textDecoration: "underline" }}>
              {showDetails ? "Ocultar detalhes" : "Saiba mais"}
            </button>
          </p>
          {showDetails && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["🔒 Essenciais", "Necessários para o funcionamento básico. Sempre ativos.", true],
                ["📊 Analíticos", "Google Analytics — visitas anônimas para melhorar o site.", false],
                ["📢 Publicidade", "Google AdSense — anúncios relevantes baseados no contexto.", false],
              ].map(([nome, desc, always]) => (
                <div key={nome} style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#080c17", borderRadius: 8, padding: "8px 12px", border: "1px solid #1e2840" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#c8d4f0" }}>{nome}</div>
                    <div style={{ fontSize: "0.62rem", color: "#5a6a9a", marginTop: 2 }}>{desc}</div>
                  </div>
                  <div style={{ fontSize: "0.6rem", color: always ? "#4ade80" : "#4a5880", fontFamily: "'DM Mono',monospace", flexShrink: 0, marginTop: 2 }}>
                    {always ? "SEMPRE ATIVO" : "OPCIONAL"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Botões */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={() => accept(false)} style={{
            background: "transparent", border: "1.5px solid #2a3860",
            color: "#8899cc", borderRadius: 8, padding: "9px 18px",
            fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
            fontFamily: "'Sora',sans-serif", whiteSpace: "nowrap",
          }}>
            Só essenciais
          </button>
          <button onClick={() => accept(true)} style={{
            background: "linear-gradient(135deg,#4a7cff,#7b4fff)",
            border: "none", color: "#fff", borderRadius: 8, padding: "9px 22px",
            fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
            fontFamily: "'Sora',sans-serif", whiteSpace: "nowrap",
            boxShadow: "0 4px 16px #4a7cff44",
          }}>
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
