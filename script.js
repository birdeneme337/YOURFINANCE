const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ==================== Sabitler ====================

const CURRENCIES = ["TRY", "USD", "EGP"];
const CURRENCY_SYMBOLS = { TRY: "₺", USD: "$", EGP: "E£" };
const CURRENCY_LABELS = { TRY: "Türk Lirası", USD: "Dolar", EGP: "Mısır Lirası" };

const PAYMENT_METHODS = ["Nakit", "Türk Bankası", "InstaPay"];

const CATEGORIES = {
  gelir: ["Maaş", "Ek Gelir", "Yatırım Geliri", "Diğer Gelir"],
  gider: [
    "Kira",
    "Market",
    "Fatura",
    "Ulaşım",
    "Sağlık",
    "Eğlence",
    "Giyim",
    "Abonelik",
    "Yatırım",
    "Diğer Gider",
  ],
};

const CATEGORY_COLORS = {
  Kira: "#A6472F",
  Market: "#7A8C5D",
  Fatura: "#4F6B8F",
  Ulaşım: "#B08948",
  Sağlık: "#6B4F8F",
  Eğlence: "#C77B4A",
  Giyim: "#8C6B8F",
  Abonelik: "#5A7A6E",
  Yatırım: "#C9A227",
  "Diğer Gider": "#7A6A58",
};

const INVESTMENT_TYPES = [
  { key: "altin", label: "Altın", unit: "gr" },
  { key: "doviz", label: "Döviz", unit: null },
  { key: "hisse", label: "Borsa / Hisse", unit: "adet" },
  { key: "kripto", label: "Kripto", unit: "adet" },
  { key: "diger", label: "Diğer", unit: "adet" },
];

const STORAGE_KEYS = {
  tx: "finansim_transactions",
  recurring: "finansim_recurring",
  recurringLog: "finansim_recurring_log",
  investments: "finansim_investments",
  rates: "finansim_rates",
};

const FALLBACK_RATES = { USD: 34, EGP: 0.71 };

const SEED_TRANSACTIONS = [
  {
    id: "seed-1",
    date: todayStr(-1),
    description: "Maaş Ödemesi",
    note: "Aylık maaş",
    amount: 25500,
    currency: "TRY",
    rateToTRY: 1,
    amountTRY: 25500,
    type: "gelir",
    category: "Maaş",
    paymentMethod: "Türk Bankası",
  },
  {
    id: "seed-2",
    date: todayStr(-1),
    description: "Kira Ödemesi",
    note: "Bu ayki kira",
    amount: 27000,
    currency: "TRY",
    rateToTRY: 1,
    amountTRY: 27000,
    type: "gider",
    category: "Kira",
    paymentMethod: "Türk Bankası",
  },
];

// ==================== localStorage yardımcıları ====================

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

// ==================== Genel yardımcı fonksiyonlar ====================

function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
function monthKey(dateObjOrStr) {
  const d = typeof dateObjOrStr === "string" ? new Date(dateObjOrStr) : dateObjOrStr;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function formatAmount(amount, currency) {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(Math.round(amount));
  return `${sign}${CURRENCY_SYMBOLS[currency]}${abs.toLocaleString("tr-TR")}`;
}
function formatDateTR(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}
function toTRY(amount, currency, rates) {
  if (currency === "TRY") return amount;
  return amount * (rates[currency] || FALLBACK_RATES[currency]);
}
function fromTRY(amountTRY, currency, rates) {
  if (currency === "TRY") return amountTRY;
  const rate = rates[currency] || FALLBACK_RATES[currency];
  return rate ? amountTRY / rate : 0;
}
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function startOfYear(date) {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function toISODate(d) {
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function groupTrend(transactions, startDate, endDate) {
  const span = daysBetween(startDate, endDate);
  const buckets = new Map();
  let mode = "day";
  if (span > 31 && span <= 120) mode = "week";
  else if (span > 120) mode = "month";

  function bucketKey(dateStr) {
    const d = new Date(dateStr);
    if (mode === "day") return dateStr;
    if (mode === "week") return toISODate(getMonday(d));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  function bucketLabel(key) {
    if (mode === "day" || mode === "week") {
      const [, m, d] = key.split("-");
      return `${d}.${m}`;
    }
    const [y, m] = key.split("-");
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    return `${months[parseInt(m, 10) - 1]} ${y.slice(2)}`;
  }

  transactions.forEach((t) => {
    const key = bucketKey(t.date);
    if (!buckets.has(key)) buckets.set(key, { key, gelir: 0, gider: 0 });
    const bucket = buckets.get(key);
    if (t.type === "gelir") bucket.gelir += t.amountTRY;
    else bucket.gider += t.amountTRY;
  });

  return Array.from(buckets.keys())
    .sort()
    .map((k) => ({ ...buckets.get(k), label: bucketLabel(k) }));
}

// ==================== Küçük ortak bileşenler ====================

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}
function Section({ title, right, children }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}
function QuickRangeButton({ label, active, onClick }) {
  return (
    <button className={`chip ${active ? "chip-active" : ""}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}

// ==================== Grafik bileşenleri (Chart.js) ====================

function TrendChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Gelir",
            data: data.map((d) => d.gelir),
            borderColor: "#2F6E4F",
            backgroundColor: "#2F6E4F",
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: "Gider",
            data: data.map((d) => d.gider),
            borderColor: "#A6472F",
            backgroundColor: "#A6472F",
            tension: 0.3,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#171D24", font: { size: 12 } } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatAmount(ctx.parsed.y, "TRY")}` } },
        },
        scales: {
          x: { grid: { color: "#DCD3BC" }, ticks: { color: "#5C6570", font: { size: 11 } } },
          y: {
            grid: { color: "#DCD3BC" },
            ticks: { color: "#5C6570", font: { size: 11 }, callback: (v) => `${Math.round(v / 1000)}b` },
          },
        },
      },
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  return (
    <div className="chart-box">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

function ExpensePieChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: data.map((d) => CATEGORY_COLORS[d.name] || "#8C8471"),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "58%",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatAmount(ctx.parsed, "TRY")}` } },
        },
      },
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  return (
    <div className="chart-box small">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

// ==================== Ana Uygulama ====================

function FinansimApp() {
  const [transactions, setTransactions] = useState(() => loadJSON(STORAGE_KEYS.tx, SEED_TRANSACTIONS));
  const [recurring, setRecurring] = useState(() => loadJSON(STORAGE_KEYS.recurring, []));
  const [recurringLog, setRecurringLog] = useState(() => loadJSON(STORAGE_KEYS.recurringLog, []));
  const [investments, setInvestments] = useState(() => loadJSON(STORAGE_KEYS.investments, []));
  const [rates, setRates] = useState(() => loadJSON(STORAGE_KEYS.rates, { ...FALLBACK_RATES, source: "fallback", lastUpdated: null }));

  const [activeTab, setActiveTab] = useState("ozet");
  const [showTxForm, setShowTxForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [startDate, setStartDate] = useState(toISODate(startOfMonth(new Date())));
  const [endDate, setEndDate] = useState(todayStr());
  const [typeFilter, setTypeFilter] = useState("tumu");
  const [categoryFilter, setCategoryFilter] = useState("tumu");
  const [currencyFilter, setCurrencyFilter] = useState("tumu");

  // İlk açılışta kur daha önce hiç kaydedilmemişse otomatik çekmeyi dene
  useEffect(() => {
    const stored = loadJSON(STORAGE_KEYS.rates, null);
    if (!stored) fetchLiveRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLiveRates() {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      if (data && data.rates && data.rates.TRY && data.rates.EGP) {
        const usdToTry = data.rates.TRY;
        const usdToEgp = data.rates.EGP;
        const egpToTry = usdToTry / usdToEgp;
        const next = { USD: usdToTry, EGP: egpToTry, source: "auto", lastUpdated: new Date().toISOString() };
        setRates(next);
        saveJSON(STORAGE_KEYS.rates, next);
        return true;
      }
      throw new Error("Beklenmeyen yanıt");
    } catch (e) {
      setRates((prev) => ({ ...prev, source: prev.source === "auto" ? prev.source : "fallback" }));
      return false;
    }
  }

  function updateManualRate(currency, value) {
    const parsed = parseFloat(String(value).replace(",", "."));
    setRates((prev) => {
      const next = { ...prev, [currency]: isNaN(parsed) ? prev[currency] : parsed, source: "manual", lastUpdated: new Date().toISOString() };
      saveJSON(STORAGE_KEYS.rates, next);
      return next;
    });
  }

  function persist(key, setter, value) {
    setter(value);
    const ok = saveJSON(key, value);
    setSaveError(ok ? "" : "Kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.");
  }

  // ---------- İşlemler ----------
  function addTransaction(t) {
    const rateToTRY = t.currency === "TRY" ? 1 : rates[t.currency] || FALLBACK_RATES[t.currency];
    const full = { ...t, rateToTRY, amountTRY: t.amount * rateToTRY };
    persist(STORAGE_KEYS.tx, setTransactions, [full, ...transactions]);
    setShowTxForm(false);
  }
  function deleteTransaction(id) {
    persist(STORAGE_KEYS.tx, setTransactions, transactions.filter((t) => t.id !== id));
  }

  // ---------- Sabit ödemeler ----------
  function addRecurring(r) {
    persist(STORAGE_KEYS.recurring, setRecurring, [r, ...recurring]);
    setShowRecurringForm(false);
  }
  function deleteRecurring(id) {
    persist(STORAGE_KEYS.recurring, setRecurring, recurring.filter((r) => r.id !== id));
  }
  function confirmRecurring(selectedIds) {
    const curKey = monthKey(new Date());
    const newTx = [];
    selectedIds.forEach((id) => {
      const r = recurring.find((x) => x.id === id);
      if (!r) return;
      const rateToTRY = r.currency === "TRY" ? 1 : rates[r.currency] || FALLBACK_RATES[r.currency];
      newTx.push({
        id: `rec-${id}-${curKey}-${Date.now()}`,
        date: todayStr(),
        description: r.description,
        note: "Sabit ödeme (otomatik onaylandı)",
        amount: r.amount,
        currency: r.currency,
        rateToTRY,
        amountTRY: r.amount * rateToTRY,
        type: r.type,
        category: r.category,
        paymentMethod: r.paymentMethod,
        fromRecurring: true,
      });
    });
    persist(STORAGE_KEYS.tx, setTransactions, [...newTx, ...transactions]);
    persist(STORAGE_KEYS.recurringLog, setRecurringLog, [...recurringLog, ...selectedIds.map((id) => `${id}:${curKey}`)]);
  }

  const pendingRecurring = useMemo(() => {
    const curKey = monthKey(new Date());
    return recurring.filter((r) => !recurringLog.includes(`${r.id}:${curKey}`));
  }, [recurring, recurringLog]);

  // ---------- Yatırımlar ----------
  function addInvestment(inv) {
    persist(STORAGE_KEYS.investments, setInvestments, [inv, ...investments]);
    setShowInvestmentForm(false);
  }
  function deleteInvestment(id) {
    persist(STORAGE_KEYS.investments, setInvestments, investments.filter((i) => i.id !== id));
  }

  // ---------- Filtrelenmiş veriler ----------
  const filtered = useMemo(() => {
    return transactions
      .filter((t) => t.date >= startDate && t.date <= endDate)
      .filter((t) => typeFilter === "tumu" || t.type === typeFilter)
      .filter((t) => categoryFilter === "tumu" || t.category === categoryFilter)
      .filter((t) => currencyFilter === "tumu" || t.currency === currencyFilter)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions, startDate, endDate, typeFilter, categoryFilter, currencyFilter]);

  const totals = useMemo(() => {
    const gelir = filtered.filter((t) => t.type === "gelir").reduce((s, t) => s + t.amountTRY, 0);
    const gider = filtered.filter((t) => t.type === "gider").reduce((s, t) => s + t.amountTRY, 0);
    const net = gelir - gider;
    const oran = gelir > 0 ? Math.round((net / gelir) * 100) : 0;
    return { gelir, gider, net, oran };
  }, [filtered]);

  const trendData = useMemo(() => groupTrend(filtered, startDate, endDate), [filtered, startDate, endDate]);

  const pieData = useMemo(() => {
    const map = new Map();
    filtered.filter((t) => t.type === "gider").forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amountTRY));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const allCategoriesInRange = useMemo(() => Array.from(new Set(filtered.map((t) => t.category))).sort(), [filtered]);

  function applyQuickRange(kind) {
    const now = new Date();
    if (kind === "bugun") {
      setStartDate(todayStr());
      setEndDate(todayStr());
    } else if (kind === "hafta") {
      setStartDate(toISODate(getMonday(now)));
      setEndDate(todayStr());
    } else if (kind === "ay") {
      setStartDate(toISODate(startOfMonth(now)));
      setEndDate(todayStr());
    } else if (kind === "yil") {
      setStartDate(toISODate(startOfYear(now)));
      setEndDate(todayStr());
    } else if (kind === "tumu" && transactions.length) {
      const earliest = transactions.reduce((min, t) => (t.date < min ? t.date : min), transactions[0].date);
      setStartDate(earliest);
      setEndDate(todayStr());
    }
  }
  const activeQuickRange = useMemo(() => {
    const now = new Date();
    const t = todayStr();
    if (startDate === t && endDate === t) return "bugun";
    if (startDate === toISODate(getMonday(now)) && endDate === t) return "hafta";
    if (startDate === toISODate(startOfMonth(now)) && endDate === t) return "ay";
    if (startDate === toISODate(startOfYear(now)) && endDate === t) return "yil";
    return null;
  }, [startDate, endDate]);

  // ---------- Varlık (tüm zamanlar) ----------
  const cashByCurrency = useMemo(() => {
    const map = { TRY: {}, USD: {}, EGP: {} };
    CURRENCIES.forEach((c) => PAYMENT_METHODS.forEach((m) => (map[c][m] = 0)));
    transactions.forEach((t) => {
      const sign = t.type === "gelir" ? 1 : -1;
      if (!map[t.currency]) return;
      map[t.currency][t.paymentMethod] = (map[t.currency][t.paymentMethod] || 0) + sign * t.amount;
    });
    return map;
  }, [transactions]);

  const cashTotalsByCurrency = useMemo(() => {
    const out = {};
    CURRENCIES.forEach((c) => {
      out[c] = PAYMENT_METHODS.reduce((s, m) => s + (cashByCurrency[c][m] || 0), 0);
    });
    return out;
  }, [cashByCurrency]);

  const cashTotalTRY = useMemo(
    () => CURRENCIES.reduce((s, c) => s + toTRY(cashTotalsByCurrency[c] || 0, c, rates), 0),
    [cashTotalsByCurrency, rates]
  );
  const investmentsTotalTRY = useMemo(() => investments.reduce((s, i) => s + i.quantity * i.priceTRY, 0), [investments]);
  const netWorthTRY = cashTotalTRY + investmentsTotalTRY;
  const netWorthUSD = fromTRY(netWorthTRY, "USD", rates);
  const netWorthEGP = fromTRY(netWorthTRY, "EGP", rates);

  return (
    <div className="phone no-print">
      <header className="topbar">
        <div className="brand">
          Finans<span>ım</span>
        </div>
        <button className="btn-pdf" onClick={() => window.print()}>
          PDF
        </button>
      </header>

      {saveError && <div className="save-error">{saveError}</div>}

      <main className="tab-content">
        {activeTab === "ozet" && (
          <OzetTab
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            allCategoriesInRange={allCategoriesInRange}
            activeQuickRange={activeQuickRange}
            applyQuickRange={applyQuickRange}
            totals={totals}
            trendData={trendData}
            pieData={pieData}
            filteredCount={filtered.length}
          />
        )}

        {activeTab === "islemler" && (
          <IslemlerTab filtered={filtered} currencyFilter={currencyFilter} setCurrencyFilter={setCurrencyFilter} onDelete={deleteTransaction} />
        )}

        {activeTab === "varlik" && (
          <VarlikTab
            rates={rates}
            onRefreshRates={fetchLiveRates}
            onManualRate={updateManualRate}
            cashByCurrency={cashByCurrency}
            cashTotalsByCurrency={cashTotalsByCurrency}
            netWorthTRY={netWorthTRY}
            netWorthUSD={netWorthUSD}
            netWorthEGP={netWorthEGP}
            investments={investments}
            investmentsTotalTRY={investmentsTotalTRY}
            onDeleteInvestment={deleteInvestment}
          />
        )}

        {activeTab === "sabit" && (
          <SabitTab recurring={recurring} pendingRecurring={pendingRecurring} onConfirm={confirmRecurring} onDelete={deleteRecurring} />
        )}
      </main>

      <button
        className="fab"
        onClick={() => {
          if (activeTab === "varlik") setShowInvestmentForm(true);
          else if (activeTab === "sabit") setShowRecurringForm(true);
          else setShowTxForm(true);
        }}
        aria-label="Ekle"
      >
        +
      </button>

      <nav className="bottom-nav">
        <NavButton label="Özet" active={activeTab === "ozet"} onClick={() => setActiveTab("ozet")} />
        <NavButton label="İşlemler" active={activeTab === "islemler"} onClick={() => setActiveTab("islemler")} />
        <NavButton label="Varlık" active={activeTab === "varlik"} onClick={() => setActiveTab("varlik")} />
        <NavButton label="Sabit" active={activeTab === "sabit"} onClick={() => setActiveTab("sabit")} badge={pendingRecurring.length || null} />
      </nav>

      {showTxForm && <TransactionForm onClose={() => setShowTxForm(false)} onSave={addTransaction} rates={rates} />}
      {showRecurringForm && <RecurringForm onClose={() => setShowRecurringForm(false)} onSave={addRecurring} />}
      {showInvestmentForm && <InvestmentForm onClose={() => setShowInvestmentForm(false)} onSave={addInvestment} rates={rates} />}

      <PrintReport transactions={filtered} startDate={startDate} endDate={endDate} totals={totals} pieData={pieData} />
    </div>
  );
}

function NavButton({ label, active, onClick, badge }) {
  return (
    <button className={`nav-btn ${active ? "nav-active" : ""}`} onClick={onClick}>
      {label}
      {badge ? <span className="nav-badge">{badge}</span> : null}
    </button>
  );
}

// ==================== ÖZET TAB ====================

function OzetTab({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  allCategoriesInRange,
  activeQuickRange,
  applyQuickRange,
  totals,
  trendData,
  pieData,
  filteredCount,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="tab-pane">
      <div className="chip-row scrollable">
        <QuickRangeButton label="Bugün" active={activeQuickRange === "bugun"} onClick={() => applyQuickRange("bugun")} />
        <QuickRangeButton label="Bu Hafta" active={activeQuickRange === "hafta"} onClick={() => applyQuickRange("hafta")} />
        <QuickRangeButton label="Bu Ay" active={activeQuickRange === "ay"} onClick={() => applyQuickRange("ay")} />
        <QuickRangeButton label="Bu Yıl" active={activeQuickRange === "yil"} onClick={() => applyQuickRange("yil")} />
        <QuickRangeButton label="Tümü" active={false} onClick={() => applyQuickRange("tumu")} />
        <button className="chip chip-outline" onClick={() => setShowFilters((s) => !s)}>
          Filtrele {showFilters ? "▲" : "▼"}
        </button>
      </div>

      {showFilters && (
        <div className="filter-drawer">
          <label className="field-inline">
            <span>Başlangıç</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label className="field-inline">
            <span>Bitiş</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label className="field-inline">
            <span>İşlem türü</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="tumu">Tümü</option>
              <option value="gelir">Gelir</option>
              <option value="gider">Gider</option>
            </select>
          </label>
          <label className="field-inline">
            <span>Kategori</span>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="tumu">Tüm kategoriler</option>
              {allCategoriesInRange.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="stat-grid">
        <StatCell label="Toplam Gelir" value={formatAmount(totals.gelir, "TRY")} tone="positive" />
        <StatCell label="Toplam Gider" value={formatAmount(totals.gider, "TRY")} tone="negative" />
        <StatCell label="Net Birikim" value={formatAmount(totals.net, "TRY")} tone={totals.net >= 0 ? "positive" : "negative"} />
        <StatCell label="Birikim Oranı" value={`%${totals.oran}`} />
      </div>
      <p className="hint-text">Tüm tutarlar, seçilen aralıktaki işlem anındaki kura göre TL karşılığı üzerinden hesaplanır.</p>

      <Section title="Gelir / Gider Trendi">
        {trendData.length === 0 ? <EmptyState text="Bu aralıkta işlem yok." /> : <TrendChart data={trendData} />}
      </Section>

      <Section title="Gider Dağılımı">
        {pieData.length === 0 ? (
          <EmptyState text="Bu aralıkta gider yok." />
        ) : (
          <>
            <ExpensePieChart data={pieData} />
            <ul className="legend-list">
              {pieData.map((entry) => (
                <li key={entry.name}>
                  <span className="legend-dot" style={{ background: CATEGORY_COLORS[entry.name] || "#8C8471" }} />
                  <span className="legend-name">{entry.name}</span>
                  <span className="legend-value">{formatAmount(entry.value, "TRY")}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      <div className="tip-box">
        <p>
          {filteredCount === 0
            ? "Bu aralıkta henüz işlem yok. İşlem eklemek için aşağıdaki + butonuna dokun."
            : totals.oran >= 20
            ? "Bu aralıkta gelirinin önemli bir kısmını biriktiriyorsun. Fazlayı Varlık sekmesinden bir yatırıma aktarmayı değerlendirebilirsin."
            : totals.oran >= 0
            ? "Biraz birikim yapıyorsun. Gider dağılımındaki en büyük kalemi gözden geçirerek oranı artırabilirsin."
            : "Bu aralıkta giderlerin gelirini aştı. En büyük gider kalemini bulup önce onu kısmayı dene."}
        </p>
      </div>
    </div>
  );
}

function StatCell({ label, value, tone }) {
  const color = tone === "positive" ? "var(--forest)" : tone === "negative" ? "var(--brick)" : "var(--ink)";
  return (
    <div className="stat-cell">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

// ==================== İŞLEMLER TAB ====================

function IslemlerTab({ filtered, currencyFilter, setCurrencyFilter, onDelete }) {
  return (
    <div className="tab-pane">
      <div className="chip-row">
        <QuickRangeButton label="Tüm Birimler" active={currencyFilter === "tumu"} onClick={() => setCurrencyFilter("tumu")} />
        {CURRENCIES.map((c) => (
          <QuickRangeButton key={c} label={c} active={currencyFilter === c} onClick={() => setCurrencyFilter(c)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="Bu aralıkta işlem bulunamadı." />
      ) : (
        <ul className="tx-list">
          {filtered.map((t) => (
            <li key={t.id} className="tx-row">
              <div className="tx-main">
                <div className="tx-desc">{t.description}</div>
                <div className="tx-meta">
                  {formatDateTR(t.date)} · {t.category} · {t.paymentMethod}
                </div>
                {t.note && <div className="tx-note">{t.note}</div>}
              </div>
              <div className="tx-right">
                <div className={`tx-amount ${t.type === "gelir" ? "amount-income" : "amount-expense"}`}>
                  {t.type === "gelir" ? "+" : "-"}
                  {formatAmount(t.amount, t.currency)}
                </div>
                {t.currency !== "TRY" && <div className="tx-try">≈ {formatAmount(t.amountTRY, "TRY")}</div>}
                <button className="text-btn danger" onClick={() => onDelete(t.id)}>
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ==================== VARLIK TAB ====================

function VarlikTab({
  rates,
  onRefreshRates,
  onManualRate,
  cashByCurrency,
  cashTotalsByCurrency,
  netWorthTRY,
  netWorthUSD,
  netWorthEGP,
  investments,
  investmentsTotalTRY,
  onDeleteInvestment,
}) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await onRefreshRates();
    setRefreshing(false);
  }

  return (
    <div className="tab-pane">
      <div className="networth-card">
        <div className="networth-label">Toplam Varlık</div>
        <div className="networth-value">{formatAmount(netWorthTRY, "TRY")}</div>
        <div className="networth-sub">
          {formatAmount(netWorthUSD, "USD")} · {formatAmount(netWorthEGP, "EGP")}
        </div>
      </div>

      <Section title="Nakit / Banka">
        {CURRENCIES.map((c) => (
          <div key={c} className="cash-row">
            <div className="cash-row-head">
              <span>{CURRENCY_LABELS[c]}</span>
              <strong>{formatAmount(cashTotalsByCurrency[c] || 0, c)}</strong>
            </div>
            <div className="cash-sub-row">
              {PAYMENT_METHODS.map((m) => (
                <span key={m} className="cash-sub-item">
                  {m}: {formatAmount(cashByCurrency[c][m] || 0, c)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Yatırımlar">
        {investments.length === 0 ? (
          <EmptyState text="Henüz yatırım eklemedin. + ile ekleyebilirsin." />
        ) : (
          <>
            <ul className="invest-list">
              {investments.map((i) => (
                <li key={i.id} className="invest-row">
                  <div>
                    <div className="invest-name">{i.name}</div>
                    <div className="invest-meta">
                      {i.quantity.toLocaleString("tr-TR")} {i.unit} × {formatAmount(i.priceTRY, "TRY")}
                    </div>
                  </div>
                  <div className="invest-right">
                    <strong>{formatAmount(i.quantity * i.priceTRY, "TRY")}</strong>
                    <button className="text-btn danger" onClick={() => onDeleteInvestment(i.id)}>
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="invest-total">
              <span>Yatırım Toplamı</span>
              <strong>{formatAmount(investmentsTotalTRY, "TRY")}</strong>
            </div>
          </>
        )}
      </Section>

      <Section
        title="Döviz Kurları"
        right={
          <button className="icon-btn" onClick={handleRefresh} aria-label="Kuru güncelle">
            <span className={refreshing ? "spin" : ""}>↻</span>
          </button>
        }
      >
        <div className="rate-note">
          {rates.source === "auto" && "Otomatik çekildi"}
          {rates.source === "manual" && "Elle girildi"}
          {rates.source === "fallback" && "Yaklaşık değer — güncellemeni öneririz"}
          {rates.lastUpdated && ` · ${new Date(rates.lastUpdated).toLocaleString("tr-TR")}`}
        </div>
        {["USD", "EGP"].map((c) => (
          <label className="field rate-field" key={c}>
            <span>1 {c} = ? TRY</span>
            <input type="text" inputMode="decimal" value={rates[c]} onChange={(e) => onManualRate(c, e.target.value)} />
          </label>
        ))}
      </Section>
    </div>
  );
}

// ==================== SABİT ÖDEMELER TAB ====================

function SabitTab({ recurring, pendingRecurring, onConfirm, onDelete }) {
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function confirmSelected() {
    if (selected.length === 0) return;
    onConfirm(selected);
    setSelected([]);
  }

  return (
    <div className="tab-pane">
      {pendingRecurring.length > 0 && (
        <Section title="Bu Ayki Onaylar">
          <ul className="recurring-list">
            {pendingRecurring.map((r) => (
              <li key={r.id} className={`recurring-row selectable ${selected.includes(r.id) ? "selected" : ""}`} onClick={() => toggle(r.id)}>
                <div className="check-box">{selected.includes(r.id) ? "✓" : ""}</div>
                <div className="recurring-main">
                  <div className="recurring-desc">{r.description}</div>
                  <div className="recurring-meta">
                    Her ayın {r.dayOfMonth}. günü · {r.category} · {r.paymentMethod}
                  </div>
                </div>
                <div className={`recurring-amount ${r.type === "gelir" ? "amount-income" : "amount-expense"}`}>
                  {r.type === "gelir" ? "+" : "-"}
                  {formatAmount(r.amount, r.currency)}
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary full-width" onClick={confirmSelected} disabled={selected.length === 0}>
            Seçilenleri Onayla ve Ekle ({selected.length})
          </button>
        </Section>
      )}

      <Section title="Tanımlı Sabit Ödemeler">
        {recurring.length === 0 ? (
          <EmptyState text="Henüz sabit ödeme tanımlamadın. + ile ekleyebilirsin." />
        ) : (
          <ul className="recurring-list">
            {recurring.map((r) => (
              <li key={r.id} className="recurring-row">
                <div className="recurring-main">
                  <div className="recurring-desc">{r.description}</div>
                  <div className="recurring-meta">
                    Her ayın {r.dayOfMonth}. günü · {r.category} · {r.paymentMethod}
                  </div>
                </div>
                <div className={`recurring-amount ${r.type === "gelir" ? "amount-income" : "amount-expense"}`}>
                  {r.type === "gelir" ? "+" : "-"}
                  {formatAmount(r.amount, r.currency)}
                </div>
                <button className="text-btn danger" onClick={() => onDelete(r.id)}>
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

// ==================== FORMLAR ====================

function TransactionForm({ onClose, onSave, rates }) {
  const [type, setType] = useState("gider");
  const [date, setDate] = useState(todayStr());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [category, setCategory] = useState(CATEGORIES.gider[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const categoryOptions = type === "gelir" ? CATEGORIES.gelir : CATEGORIES.gider;
  useEffect(() => setCategory(categoryOptions[0]), [type]); // eslint-disable-line

  const parsedAmount = parseFloat(String(amount).replace(",", "."));
  const preview = currency !== "TRY" && parsedAmount > 0 ? parsedAmount * (rates[currency] || FALLBACK_RATES[currency]) : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return setError("Açıklama girin.");
    if (!parsedAmount || parsedAmount <= 0) return setError("Geçerli bir tutar girin.");
    onSave({
      id: `t-${Date.now()}`,
      date,
      description: description.trim(),
      note: note.trim(),
      amount: parsedAmount,
      currency,
      type,
      category,
      paymentMethod,
    });
  }

  return (
    <ModalShell title="Yeni İşlem" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="type-toggle">
          <button type="button" className={`toggle-btn ${type === "gelir" ? "toggle-active-income" : ""}`} onClick={() => setType("gelir")}>
            Gelir
          </button>
          <button type="button" className={`toggle-btn ${type === "gider" ? "toggle-active-expense" : ""}`} onClick={() => setType("gider")}>
            Gider
          </button>
        </div>

        <label className="field">
          <span>Tarih</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="field">
          <span>Açıklama</span>
          <input
            type="text"
            placeholder={type === "gelir" ? "Örn. Eylül Maaşı" : "Örn. Market Alışverişi"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="two-col">
          <label className="field">
            <span>Tutar</span>
            <input type="text" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className="field">
            <span>Para Birimi</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        {preview !== null && <div className="preview-line">≈ {formatAmount(preview, "TRY")}</div>}

        <label className="field">
          <span>Kategori</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Ödeme Yöntemi</span>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Not (opsiyonel)</span>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn-primary">
            Kaydet
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function RecurringForm({ onClose, onSave }) {
  const [type, setType] = useState("gider");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [category, setCategory] = useState(CATEGORIES.gider[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [error, setError] = useState("");

  const categoryOptions = type === "gelir" ? CATEGORIES.gelir : CATEGORIES.gider;
  useEffect(() => setCategory(categoryOptions[0]), [type]); // eslint-disable-line

  function handleSubmit(e) {
    e.preventDefault();
    const parsedAmount = parseFloat(String(amount).replace(",", "."));
    const day = parseInt(dayOfMonth, 10);
    if (!description.trim()) return setError("Açıklama girin.");
    if (!parsedAmount || parsedAmount <= 0) return setError("Geçerli bir tutar girin.");
    if (!day || day < 1 || day > 31) return setError("Ayın günü 1-31 arası olmalı.");
    onSave({
      id: `rec-${Date.now()}`,
      description: description.trim(),
      amount: parsedAmount,
      currency,
      type,
      category,
      paymentMethod,
      dayOfMonth: day,
    });
  }

  return (
    <ModalShell title="Sabit Ödeme Tanımla" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="type-toggle">
          <button type="button" className={`toggle-btn ${type === "gelir" ? "toggle-active-income" : ""}`} onClick={() => setType("gelir")}>
            Gelir
          </button>
          <button type="button" className={`toggle-btn ${type === "gider" ? "toggle-active-expense" : ""}`} onClick={() => setType("gider")}>
            Gider
          </button>
        </div>
        <label className="field">
          <span>Açıklama</span>
          <input type="text" placeholder="Örn. Kira, Netflix, Maaş" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="two-col">
          <label className="field">
            <span>Tutar</span>
            <input type="text" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className="field">
            <span>Para Birimi</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>Kategori</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Ödeme Yöntemi</span>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Ayın Günü</span>
          <input type="number" min="1" max="31" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn-primary">
            Kaydet
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function InvestmentForm({ onClose, onSave, rates }) {
  const [investType, setInvestType] = useState("altin");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [dovizCurrency, setDovizCurrency] = useState("USD");
  const [error, setError] = useState("");

  const typeInfo = INVESTMENT_TYPES.find((t) => t.key === investType);
  const unit = investType === "doviz" ? dovizCurrency : typeInfo.unit;

  useEffect(() => {
    if (investType === "doviz") {
      const rate = rates[dovizCurrency] || FALLBACK_RATES[dovizCurrency];
      setPrice(String(Math.round(rate * 100) / 100));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investType, dovizCurrency]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = parseFloat(String(quantity).replace(",", "."));
    const p = parseFloat(String(price).replace(",", "."));
    if (!name.trim()) return setError("Yatırım adı girin.");
    if (!q || q <= 0) return setError("Geçerli bir miktar girin.");
    if (!p || p <= 0) return setError("Geçerli bir birim fiyat girin (TRY).");
    onSave({ id: `inv-${Date.now()}`, name: name.trim(), type: investType, quantity: q, unit, priceTRY: p });
  }

  return (
    <ModalShell title="Yatırım Ekle" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <label className="field">
          <span>Yatırım Türü</span>
          <select value={investType} onChange={(e) => setInvestType(e.target.value)}>
            {INVESTMENT_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        {investType === "doviz" && (
          <label className="field">
            <span>Hangi Döviz</span>
            <select value={dovizCurrency} onChange={(e) => setDovizCurrency(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EGP">EGP</option>
            </select>
          </label>
        )}

        <label className="field">
          <span>İsim</span>
          <input
            type="text"
            placeholder={
              investType === "altin" ? "Örn. Cumhuriyet Altını" : investType === "hisse" ? "Örn. THYAO" : investType === "kripto" ? "Örn. Bitcoin" : "Örn. Yatırım Dolar"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="two-col">
          <label className="field">
            <span>Miktar ({unit})</span>
            <input type="text" inputMode="decimal" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </label>
          <label className="field">
            <span>Birim Fiyat (TRY)</span>
            <input type="text" inputMode="decimal" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
        </div>
        {quantity && price && (
          <div className="preview-line">
            Toplam değer ≈ {formatAmount((parseFloat(quantity.replace(",", ".")) || 0) * (parseFloat(price.replace(",", ".")) || 0), "TRY")}
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn-primary">
            Kaydet
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ==================== YAZDIRMA (PDF) ====================

function PrintReport({ transactions, startDate, endDate, totals, pieData }) {
  return (
    <div className="print-only">
      <h1>Finansım Raporu</h1>
      <p className="print-range">
        {formatDateTR(startDate)} – {formatDateTR(endDate)}
      </p>
      <table className="print-summary-table">
        <tbody>
          <tr>
            <td>Toplam Gelir</td>
            <td className="align-right">{formatAmount(totals.gelir, "TRY")}</td>
          </tr>
          <tr>
            <td>Toplam Gider</td>
            <td className="align-right">{formatAmount(totals.gider, "TRY")}</td>
          </tr>
          <tr>
            <td>Net Birikim</td>
            <td className="align-right">{formatAmount(totals.net, "TRY")}</td>
          </tr>
          <tr>
            <td>Birikim Oranı</td>
            <td className="align-right">%{totals.oran}</td>
          </tr>
        </tbody>
      </table>

      <h2>Gider Dağılımı</h2>
      <table className="print-table">
        <thead>
          <tr>
            <th>Kategori</th>
            <th className="align-right">Tutar (TRY)</th>
          </tr>
        </thead>
        <tbody>
          {pieData.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td className="align-right">{formatAmount(p.value, "TRY")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>İşlemler</h2>
      <table className="print-table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Açıklama</th>
            <th>Kategori</th>
            <th>Birim</th>
            <th className="align-right">Tutar</th>
            <th className="align-right">TRY Karşılığı</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{formatDateTR(t.date)}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>{t.currency}</td>
              <td className="align-right">
                {t.type === "gelir" ? "+" : "-"}
                {formatAmount(t.amount, t.currency)}
              </td>
              <td className="align-right">{formatAmount(t.amountTRY, "TRY")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== Uygulamayı başlat ====================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<FinansimApp />);
