const { useState, useEffect, useMemo } = React;

const CURRENCIES = ["TRY", "USD", "EGP"];

const CURRENCY_SYMBOLS = {
  TRY: "₺",
  USD: "$",
  EGP: "E£"
};

const PAYMENT_KEYS = ["cash", "bank", "instapay"];

const FALLBACK_RATES = {
  USD: 34,
  EGP: 0.71
};

const STORAGE_KEYS = {
  transactions: "finansim_transactions",
  investments: "finansim_investments",
  recurring: "finansim_recurring",
  rates: "finansim_rates",
  language: "finansim_language"
};

const CATEGORY_KEYS = {
  income: [
    "salary",
    "extra_income",
    "investment_income",
    "other_income"
  ],
  expense: [
    "rent",
    "groceries",
    "bills",
    "transport",
    "health",
    "entertainment",
    "clothing",
    "subscription",
    "investment",
    "other_expense"
  ]
};

const INVESTMENT_TYPE_KEYS = [
  "gold",
  "forex",
  "stocks",
  "crypto",
  "other"
];

const T = {
  tr: {
    navOzet: "Özet",
    navIslemler: "İşlemler",
    navVarlik: "Varlık",
    navSabit: "Sabit",
    pdfBtn: "PDF",

    todayChip: "Bugün",
    weekChip: "Bu Hafta",
    monthChip: "Bu Ay",
    yearChip: "Bu Yıl",
    allChip: "Tümü",
    filterToggle: "Filtrele",

    startDate: "Başlangıç",
    endDate: "Bitiş",
    txType: "İşlem türü",
    allTypes: "Tümü",
    income: "Gelir",
    expense: "Gider",
    category: "Kategori",
    allCategories: "Tüm kategoriler",

    statIncome: "Toplam Gelir",
    statExpense: "Toplam Gider",
    statNet: "Net Birikim",
    statRate: "Birikim Oranı",

    hintTry:
      "Tüm tutarlar, işlem anındaki kura göre TL karşılığı üzerinden hesaplanır.",

    trendTitle: "Gelir / Gider Trendi",
    distTitle: "Gider Dağılımı",

    emptyNoTx: "Bu aralıkta işlem yok.",
    emptyNoExpense: "Bu aralıkta gider yok.",
    emptyNoTxFound: "Bu aralıkta işlem bulunamadı.",

    tipNoTx:
      "Bu aralıkta henüz işlem yok. Eklemek için aşağıdaki + butonuna dokun.",

    tipGoodRate:
      "Gelirinin önemli bir kısmını biriktiriyorsun. Fazlayı Varlık sekmesinden bir yatırıma aktarmayı değerlendirebilirsin.",

    tipOkRate:
      "Biraz birikim yapıyorsun. Gider dağılımındaki en büyük kalemi gözden geçirerek oranı artırabilirsin.",

    tipNegRate:
      "Giderlerin gelirini aştı. En büyük gider kalemini bulup önce onu kısmayı dene.",

    allCurrencies: "Tüm Birimler",
    deleteBtn: "Sil",

    totalAssets: "Toplam Varlık",
    cashBankTitle: "Nakit / Banka",
    investmentsTitle: "Yatırımlar",
    noInvestments:
      "Henüz yatırım eklemedin. + ile ekleyebilirsin.",
    investTotal: "Yatırım Toplamı",

    ratesTitle: "Döviz Kurları",
    rateManual: "Elle girildi",
    rateFallback: "Yaklaşık değer — güncellemeni öneririz",
    rateSuffix: "= ? TRY",

    thisMonthApprovals: "Bu Ayki Onaylar",
    confirmSelected: "Seçilenleri Onayla ve Ekle",

    definedRecurring: "Tanımlı Sabit Ödemeler",
    noRecurring:
      "Henüz sabit ödeme tanımlamadın. + ile ekleyebilirsin.",

    everyMonthDay: d => `Her ayın ${d}. günü`,

    newTxTitle: "Yeni İşlem",
    dateLabel: "Tarih",
    descLabel: "Açıklama",
    descPlaceholderIncome: "Örn. Eylül Maaşı",
    descPlaceholderExpense: "Örn. Market Alışverişi",
    amountLabel: "Tutar",
    currencyLabel: "Para Birimi",
    categoryLabel: "Kategori",
    paymentLabel: "Ödeme Yöntemi",
    noteLabel: "Not (opsiyonel)",

    cancelBtn: "Vazgeç",
    saveBtn: "Kaydet",

    errDesc: "Açıklama girin.",
    errAmount: "Geçerli bir tutar girin.",

    recurringTitle: "Sabit Ödeme Tanımla",
    recurringDescPlaceholder: "Örn. Kira, Netflix, Maaş",
    dayOfMonthLabel: "Ayın Günü",
    errDay: "Ayın günü 1-31 arası olmalı.",

    investFormTitle: "Yatırım Ekle",
    investTypeLabel: "Yatırım Türü",
    whichCurrency: "Hangi Döviz",
    nameLabel: "İsim",
    namePlaceholderGold: "Örn. Cumhuriyet Altını",
    namePlaceholderStock: "Örn. THYAO",
    namePlaceholderCrypto: "Örn. Bitcoin",
    namePlaceholderOther: "Örn. Yatırım Dolar",
    quantityLabel: "Miktar",
    unitPriceLabel: "Birim Fiyat (TRY)",
    previewTotal: "Toplam değer ≈",

    errName: "Yatırım adı girin.",
    errQty: "Geçerli bir miktar girin.",
    errPrice: "Geçerli bir birim fiyat girin.",

    closeAria: "Kapat",
    addAria: "Ekle",
    refreshAria: "Kuru güncelle",

    reportTitle: "Finansım Raporu",
    reportDist: "Gider Dağılımı",
    reportTx: "İşlemler",

    colDate: "Tarih",
    colDesc: "Açıklama",
    colCategory: "Kategori",
    colCurrency: "Birim",
    colAmount: "Tutar",
    colTryEq: "TRY Karşılığı",

    saveError: "Kaydedilemedi, tekrar deneyin.",
    loading: "Finansım yükleniyor…",

    cat_salary: "Maaş",
    cat_extra_income: "Ek Gelir",
    cat_investment_income: "Yatırım Geliri",
    cat_other_income: "Diğer Gelir",

    cat_rent: "Kira",
    cat_groceries: "Market",
    cat_bills: "Fatura",
    cat_transport: "Ulaşım",
    cat_health: "Sağlık",
    cat_entertainment: "Eğlence",
    cat_clothing: "Giyim",
    cat_subscription: "Abonelik",
    cat_investment: "Yatırım",
    cat_other_expense: "Diğer Gider",

    pay_cash: "Nakit",
    pay_bank: "Türk Bankası",
    pay_instapay: "InstaPay",

    cur_TRY: "Türk Lirası",
    cur_USD: "Dolar",
    cur_EGP: "Mısır Lirası",

    inv_gold: "Altın",
    inv_forex: "Döviz",
    inv_stocks: "Borsa / Hisse",
    inv_crypto: "Kripto",
    inv_other: "Diğer",

    unit_gram: "gr",
    unit_piece: "adet"
  },

  en: {
    navOzet: "Overview",
    navIslemler: "Transactions",
    navVarlik: "Assets",
    navSabit: "Recurring",
    pdfBtn: "PDF",

    todayChip: "Today",
    weekChip: "This Week",
    monthChip: "This Month",
    yearChip: "This Year",
    allChip: "All",
    filterToggle: "Filter",

    startDate: "Start",
    endDate: "End",
    txType: "Type",
    allTypes: "All",
    income: "Income",
    expense: "Expense",
    category: "Category",
    allCategories: "All categories",

    statIncome: "Total Income",
    statExpense: "Total Expense",
    statNet: "Net Savings",
    statRate: "Savings Rate",

    hintTry:
      "All amounts are converted to TRY using the exchange rate at the time of each transaction.",

    trendTitle: "Income / Expense Trend",
    distTitle: "Expense Breakdown",

    emptyNoTx: "No transactions in this range.",
    emptyNoExpense: "No expenses in this range.",
    emptyNoTxFound: "No transactions found in this range.",

    tipNoTx:
      "No transactions yet in this range. Tap the + button below to add one.",

    tipGoodRate:
      "You're saving a healthy share of your income. Consider moving the surplus into an investment from the Assets tab.",

    tipOkRate:
      "You're saving a bit. Review your biggest expense category to improve your rate.",

    tipNegRate:
      "Your expenses exceeded your income. Find your biggest expense category and try cutting it first.",

    allCurrencies: "All Currencies",
    deleteBtn: "Delete",

    totalAssets: "Total Assets",
    cashBankTitle: "Cash / Bank",
    investmentsTitle: "Investments",
    noInvestments: "No investments yet. Add one with +.",
    investTotal: "Investments Total",

    ratesTitle: "Exchange Rates",
    rateManual: "Entered manually",
    rateFallback: "Approximate value — please update",
    rateSuffix: "= ? TRY",

    thisMonthApprovals: "This Month's Approvals",
    confirmSelected: "Confirm & Add Selected",

    definedRecurring: "Defined Recurring Payments",
    noRecurring: "No recurring payments yet. Add one with +.",

    everyMonthDay: d => `Day ${d} of every month`,

    newTxTitle: "New Transaction",
    dateLabel: "Date",
    descLabel: "Description",
    descPlaceholderIncome: "e.g. September Salary",
    descPlaceholderExpense: "e.g. Grocery Shopping",
    amountLabel: "Amount",
    currencyLabel: "Currency",
    categoryLabel: "Category",
    paymentLabel: "Payment Method",
    noteLabel: "Note (optional)",

    cancelBtn: "Cancel",
    saveBtn: "Save",

    errDesc: "Enter a description.",
    errAmount: "Enter a valid amount.",

    recurringTitle: "Define Recurring Payment",
    recurringDescPlaceholder: "e.g. Rent, Netflix, Salary",
    dayOfMonthLabel: "Day of Month",
    errDay: "Day must be between 1 and 31.",

    investFormTitle: "Add Investment",
    investTypeLabel: "Investment Type",
    whichCurrency: "Which Currency",
    nameLabel: "Name",
    namePlaceholderGold: "e.g. Gold Coin",
    namePlaceholderStock: "e.g. THYAO",
    namePlaceholderCrypto: "e.g. Bitcoin",
    namePlaceholderOther: "e.g. Investment Dollars",
    quantityLabel: "Quantity",
    unitPriceLabel: "Unit Price (TRY)",
    previewTotal: "Total value ≈",

    errName: "Enter an investment name.",
    errQty: "Enter a valid quantity.",
    errPrice: "Enter a valid unit price.",

    closeAria: "Close",
    addAria: "Add",
    refreshAria: "Refresh rate",

    reportTitle: "Finansım Report",
    reportDist: "Expense Breakdown",
    reportTx: "Transactions",

    colDate: "Date",
    colDesc: "Description",
    colCategory: "Category",
    colCurrency: "Currency",
    colAmount: "Amount",
    colTryEq: "TRY Equivalent",

    saveError: "Couldn't save, please try again.",
    loading: "Loading Finansım…",

    cat_salary: "Salary",
    cat_extra_income: "Extra Income",
    cat_investment_income: "Investment Income",
    cat_other_income: "Other Income",

    cat_rent: "Rent",
    cat_groceries: "Groceries",
    cat_bills: "Bills",
    cat_transport: "Transport",
    cat_health: "Health",
    cat_entertainment: "Entertainment",
    cat_clothing: "Clothing",
    cat_subscription: "Subscription",
    cat_investment: "Investment",
    cat_other_expense: "Other Expense",

    pay_cash: "Cash",
    pay_bank: "Turkish Bank",
    pay_instapay: "InstaPay",

    cur_TRY: "Turkish Lira",
    cur_USD: "US Dollar",
    cur_EGP: "Egyptian Pound",

    inv_gold: "Gold",
    inv_forex: "Foreign Currency",
    inv_stocks: "Stocks",
    inv_crypto: "Crypto",
    inv_other: "Other",

    unit_gram: "g",
    unit_piece: "units"
  },

  ar: {
    navOzet: "الملخص",
    navIslemler: "العمليات",
    navVarlik: "الأصول",
    navSabit: "الثابت",
    pdfBtn: "PDF",

    todayChip: "النهاردة",
    weekChip: "الأسبوع ده",
    monthChip: "الشهر ده",
    yearChip: "السنة دي",
    allChip: "الكل",
    filterToggle: "فلترة",

    startDate: "من تاريخ",
    endDate: "لغاية تاريخ",
    txType: "نوع العملية",
    allTypes: "الكل",
    income: "دخل",
    expense: "مصروف",
    category: "الفئة",
    allCategories: "كل الفئات",

    statIncome: "إجمالي الدخل",
    statExpense: "إجمالي المصروف",
    statNet: "صافي الادخار",
    statRate: "نسبة الادخار",

    hintTry:
      "كل المبالغ بتتحول للجنيه التركي حسب سعر الصرف وقت العملية.",

    trendTitle: "اتجاه الدخل والمصروف",
    distTitle: "توزيع المصروفات",

    emptyNoTx: "مفيش عمليات في الفترة دي.",
    emptyNoExpense: "مفيش مصروفات في الفترة دي.",
    emptyNoTxFound: "ملقيناش عمليات في الفترة دي.",

    tipNoTx:
      "مفيش عمليات لسه. دوس على + علشان تضيف عملية.",

    tipGoodRate:
      "إنت بتوفر جزء كويس من دخلك. ممكن تحط الفائض في استثمار من صفحة الأصول.",

    tipOkRate:
      "إنت بتوفر شوية. راجع أكبر بند مصروفات علشان تزود نسبة الادخار.",

    tipNegRate:
      "مصروفاتك أكتر من دخلك. شوف أكبر بند مصروفات وحاول تقلله.",

    allCurrencies: "كل العملات",
    deleteBtn: "حذف",

    totalAssets: "إجمالي الأصول",
    cashBankTitle: "كاش / بنك",
    investmentsTitle: "الاستثمارات",
    noInvestments: "لسه مفيش استثمارات. دوس + للإضافة.",
    investTotal: "إجمالي الاستثمارات",

    ratesTitle: "أسعار العملات",
    rateManual: "مدخل يدويًا",
    rateFallback: "قيمة تقريبية — يفضل تحديثها",
    rateSuffix: "= ? TRY",

    thisMonthApprovals: "موافقات الشهر ده",
    confirmSelected: "تأكيد وإضافة المحدد",

    definedRecurring: "المدفوعات الثابتة",
    noRecurring: "لسه مفيش مدفوعات ثابتة. دوس + للإضافة.",

    everyMonthDay: d => `كل شهر يوم ${d}`,

    newTxTitle: "عملية جديدة",
    dateLabel: "التاريخ",
    descLabel: "الوصف",
    descPlaceholderIncome: "مثال: مرتب سبتمبر",
    descPlaceholderExpense: "مثال: مشتريات السوبر ماركت",
    amountLabel: "المبلغ",
    currencyLabel: "العملة",
    categoryLabel: "الفئة",
    paymentLabel: "طريقة الدفع",
    noteLabel: "ملاحظة (اختياري)",

    cancelBtn: "إلغاء",
    saveBtn: "حفظ",

    errDesc: "اكتب الوصف.",
    errAmount: "اكتب مبلغ صحيح.",

    recurringTitle: "إضافة دفع ثابت",
    recurringDescPlaceholder: "مثال: إيجار، نتفليكس، مرتب",
    dayOfMonthLabel: "يوم الشهر",
    errDay: "اليوم لازم يكون من 1 إلى 31.",

    investFormTitle: "إضافة استثمار",
    investTypeLabel: "نوع الاستثمار",
    whichCurrency: "أي عملة",
    nameLabel: "الاسم",
    namePlaceholderGold: "مثال: جنيه ذهب",
    namePlaceholderStock: "مثال: THYAO",
    namePlaceholderCrypto: "مثال: Bitcoin",
    namePlaceholderOther: "مثال: دولارات استثمار",
    quantityLabel: "الكمية",
    unitPriceLabel: "سعر الوحدة (TRY)",
    previewTotal: "القيمة الإجمالية ≈",

    errName: "اكتب اسم الاستثمار.",
    errQty: "اكتب كمية صحيحة.",
    errPrice: "اكتب سعر صحيح.",

    closeAria: "إغلاق",
    addAria: "إضافة",
    refreshAria: "تحديث السعر",

    reportTitle: "تقرير Finansım",
    reportDist: "توزيع المصروفات",
    reportTx: "العمليات",

    colDate: "التاريخ",
    colDesc: "الوصف",
    colCategory: "الفئة",
    colCurrency: "العملة",
    colAmount: "المبلغ",
    colTryEq: "ما يعادل TRY",

    saveError: "حصل خطأ أثناء الحفظ.",
    loading: "جاري تحميل Finansım…",

    cat_salary: "مرتب",
    cat_extra_income: "دخل إضافي",
    cat_investment_income: "دخل استثماري",
    cat_other_income: "دخل آخر",

    cat_rent: "إيجار",
    cat_groceries: "سوبر ماركت",
    cat_bills: "فواتير",
    cat_transport: "مواصلات",
    cat_health: "صحة",
    cat_entertainment: "ترفيه",
    cat_clothing: "ملابس",
    cat_subscription: "اشتراكات",
    cat_investment: "استثمار",
    cat_other_expense: "مصروف آخر",

    pay_cash: "كاش",
    pay_bank: "بنك تركي",
    pay_instapay: "InstaPay",

    cur_TRY: "الليرة التركية",
    cur_USD: "الدولار",
    cur_EGP: "الجنيه المصري",

    inv_gold: "ذهب",
    inv_forex: "عملات",
    inv_stocks: "بورصة / أسهم",
    inv_crypto: "كريبتو",
    inv_other: "أخرى",

    unit_gram: "جرام",
    unit_piece: "قطعة"
  }
};

function todayStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
}

function formatDateTR(value) {
  if (!value) return "";

  const d = new Date(value + "T00:00:00");

  return d.toLocaleDateString("tr-TR");
}

function formatAmount(value, currency = "TRY") {
  const symbols = CURRENCY_SYMBOLS;

  const number = Number(value || 0);

  return `${symbols[currency] || ""}${number.toLocaleString(
    "tr-TR",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  )}`;
}

function toTRY(amount, currency, rates) {
  amount = Number(amount || 0);

  if (currency === "TRY") {
    return amount;
  }

  if (currency === "USD") {
    return amount * Number(rates.USD || FALLBACK_RATES.USD);
  }

  if (currency === "EGP") {
    return amount * Number(rates.EGP || FALLBACK_RATES.EGP);
  }

  return amount;
}

function fromTRY(amountTRY, currency, rates) {
  amountTRY = Number(amountTRY || 0);

  if (currency === "TRY") return amountTRY;

  if (currency === "USD") {
    return amountTRY / Number(rates.USD || FALLBACK_RATES.USD);
  }

  if (currency === "EGP") {
    return amountTRY / Number(rates.EGP || FALLBACK_RATES.EGP);
  }

  return amountTRY;
}

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (e) {
    console.error(e);
  }
}

function startOfWeek() {
  const d = new Date();
  const day = d.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);

  return d.toISOString().slice(0, 10);
}

function startOfMonth() {
  const d = new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-01`;
}

function startOfYear() {
  const d = new Date();

  return `${d.getFullYear()}-01-01`;
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      {text}
    </div>
  );
}

function Section({ title, right, children }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {right}
      </div>

      {children}
    </section>
  );
}

function QuickRangeButton({
  label,
  active,
  onClick
}) {
  return (
    <button
      className={`chip ${
        active ? "chip-active" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function LangSwitch({ lang, onChange }) {
  return (
    <div className="lang-switch">
      {[
        ["tr", "TR"],
        ["en", "EN"],
        ["ar", "AR"]
      ].map(([key, label]) => (
        <button
          key={key}
          className={`lang-btn ${
            lang === key
              ? "lang-active"
              : ""
          }`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function NavButton({
  label,
  active,
  onClick,
  badge
}) {
  return (
    <button
      className={`nav-btn ${
        active ? "nav-active" : ""
      }`}
      onClick={onClick}
    >
      {label}

      {badge ? (
        <span className="nav-badge">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function StatCell({
  label,
  value,
  tone
}) {
  return (
    <div className="stat-cell">
      <div className="stat-label">
        {label}
      </div>

      <div
        className={`stat-value ${
          tone || ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function TrendChart({
  data,
  t
}) {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const ratio =
      window.devicePixelRatio || 1;

    canvas.width =
      rect.width * ratio;

    canvas.height =
      rect.height * ratio;

    const ctx =
      canvas.getContext("2d");

    ctx.scale(ratio, ratio);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    const max = Math.max(
      1,
      ...data.flatMap(x => [
        x.income,
        x.expense
      ])
    );

    const left = 38;
    const right = 8;
    const top = 12;
    const bottom = 28;

    const chartWidth =
      width - left - right;

    const chartHeight =
      height - top - bottom;

    ctx.font = "10px Inter";

    ctx.strokeStyle =
      "#DCD3BC";

    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y =
        top +
        chartHeight -
        (chartHeight * i) / 4;

      ctx.beginPath();

      ctx.moveTo(left, y);

      ctx.lineTo(
        width - right,
        y
      );

      ctx.stroke();

      ctx.fillStyle =
        "#5C6570";

      ctx.fillText(
        Math.round(
          (max * i) / 4
        ).toLocaleString("tr-TR"),
        2,
        y + 3
      );
    }

    if (!data.length) return;

    function drawLine(key, color) {
      ctx.beginPath();

      data.forEach((item, index) => {
        const x =
          left +
          chartWidth *
            (index /
              Math.max(
                1,
                data.length - 1
              ));

        const y =
          top +
          chartHeight -
          (chartHeight *
            item[key]) /
            max;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      ctx.stroke();
    }

    drawLine(
      "income",
      "#2F6E4F"
    );

    drawLine(
      "expense",
      "#A6472F"
    );

    ctx.fillStyle =
      "#5C6570";

    ctx.textAlign = "center";

    if (data.length <= 8) {
      data.forEach((item, index) => {
        const x =
          left +
          chartWidth *
            (index /
              Math.max(
                1,
                data.length - 1
              ));

        ctx.fillText(
          item.label,
          x,
          height - 8
        );
      });
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%"
      }}
    />
  );
}

function ExpenseChart({
  data
}) {
  const canvasRef =
    React.useRef(null);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const ratio =
      window.devicePixelRatio || 1;

    canvas.width =
      rect.width * ratio;

    canvas.height =
      rect.height * ratio;

    const ctx =
      canvas.getContext("2d");

    ctx.scale(ratio, ratio);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    const total =
      data.reduce(
        (sum, item) =>
          sum + item.value,
        0
      );

    if (!total) return;

    const cx = width / 2;
    const cy = height / 2;

    const radius =
      Math.min(
        width,
        height
      ) * 0.32;

    let angle =
      -Math.PI / 2;

    const colors = [
      "#A6472F",
      "#B08948",
      "#2F6E4F",
      "#5C6570",
      "#806B5A",
      "#8D7A66",
      "#6E5748"
    ];

    data.forEach(
      (item, index) => {
        const slice =
          (item.value / total) *
          Math.PI *
          2;

        ctx.beginPath();

        ctx.moveTo(cx, cy);

        ctx.arc(
          cx,
          cy,
          radius,
          angle,
          angle + slice
        );

        ctx.closePath();

        ctx.fillStyle =
          colors[
            index %
              colors.length
          ];

        ctx.fill();

        angle += slice;
      }
    );

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      radius * 0.58,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "#FFFEFB";

    ctx.fill();

    ctx.fillStyle =
      "#171D24";

    ctx.font =
      "600 13px Inter";

    ctx.textAlign =
      "center";

    ctx.fillText(
      formatAmount(
        total,
        "TRY"
      ),
      cx,
      cy + 4
    );
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%"
      }}
    />
  );
}

function OzetTab({
  t,
  filtered,
  totals,
  pieData,
  trendData
}) {
  const rate =
    totals.gelir > 0
      ? Math.round(
          (totals.net /
            totals.gelir) *
            100
        )
      : 0;

  let tip = t.tipNoTx;

  if (filtered.length) {
    if (rate < 0) {
      tip = t.tipNegRate;
    } else if (rate < 20) {
      tip = t.tipOkRate;
    } else {
      tip = t.tipGoodRate;
    }
  }

  return (
    <div className="tab-pane">

      <div className="stat-grid">

        <StatCell
          label={t.statIncome}
          value={formatAmount(
            totals.gelir,
            "TRY"
          )}
          tone="amount-income"
        />

        <StatCell
          label={t.statExpense}
          value={formatAmount(
            totals.gider,
            "TRY"
          )}
          tone="amount-expense"
        />

        <StatCell
          label={t.statNet}
          value={formatAmount(
            totals.net,
            "TRY"
          )}
          tone={
            totals.net >= 0
              ? "amount-income"
              : "amount-expense"
          }
        />

        <StatCell
          label={t.statRate}
          value={`%${rate}`}
        />

      </div>

      <p className="hint-text">
        {t.hintTry}
      </p>

      <Section
        title={t.trendTitle}
      >
        <div
          className="chart-container"
          style={{
            height: 190
          }}
        >
          <TrendChart
            data={trendData}
            t={t}
          />
        </div>

        <div className="chart-legend">
          <span>
            <i
              className="legend-dot"
              style={{
                background:
                  "#2F6E4F"
              }}
            />
            {t.income}
          </span>

          <span>
            <i
              className="legend-dot"
              style={{
                background:
                  "#A6472F"
              }}
            />
            {t.expense}
          </span>
        </div>
      </Section>

      <Section
        title={t.distTitle}
      >
        <div
          className="pie-container"
          style={{
            height: 220
          }}
        >
          {pieData.length ? (
            <ExpenseChart
              data={pieData}
            />
          ) : (
            <EmptyState
              text={
                t.emptyNoExpense
              }
            />
          )}
        </div>

        {pieData.length > 0 && (
          <ul className="legend-list">
            {pieData.map(
              (item, index) => (
                <li key={item.key}>
                  <span
                    className="legend-dot"
                    style={{
                      background:
                        [
                          "#A6472F",
                          "#B08948",
                          "#2F6E4F",
                          "#5C6570",
                          "#806B5A"
                        ][
                          index % 5
                        ]
                    }}
                  />

                  <span className="legend-name">
                    {t[
                      `cat_${item.key}`
                    ]}
                  </span>

                  <span className="legend-value">
                    {formatAmount(
                      item.value,
                      "TRY"
                    )}
                  </span>
                </li>
              )
            )}
          </ul>
        )}
      </Section>

      <div className="tip-box">
        <p>{tip}</p>
      </div>
    </div>
  );
}

function IslemlerTab({
  t,
  filtered,
  currencyFilter,
  setCurrencyFilter,
  onDelete
}) {
  const list =
    currencyFilter === "ALL"
      ? filtered
      : filtered.filter(
          x =>
            x.currency ===
            currencyFilter
        );

  return (
    <div className="tab-pane">

      <div className="chip-row scrollable">

        <button
          className={`chip ${
            currencyFilter === "ALL"
              ? "chip-active"
              : ""
          }`}
          onClick={() =>
            setCurrencyFilter(
              "ALL"
            )
          }
        >
          {t.allCurrencies}
        </button>

        {CURRENCIES.map(
          currency => (
            <button
              key={currency}
              className={`chip ${
                currencyFilter ===
                currency
                  ? "chip-active"
                  : ""
              }`}
              onClick={() =>
                setCurrencyFilter(
                  currency
                )
              }
            >
              {currency}
            </button>
          )
        )}

      </div>

      <Section
        title={`${t.navIslemler} (${list.length})`}
      >

        {!list.length ? (
          <EmptyState
            text={
              t.emptyNoTxFound
            }
          />
        ) : (
          <ul className="tx-list">
            {[...list]
              .sort((a, b) =>
                b.date.localeCompare(
                  a.date
                )
              )
              .map(tx => (
                <li
                  className="tx-row"
                  key={tx.id}
                >

                  <div className="tx-main">

                    <div className="tx-desc">
                      {tx.description ||
                        t[
                          `cat_${tx.category}`
                        ]}
                    </div>

                    <div className="tx-meta">
                      {formatDateTR(
                        tx.date
                      )}{" "}
                      ·{" "}
                      {t[
                        `cat_${tx.category}`
                      ]}{" "}
                      ·{" "}
                      {t[
                        `pay_${tx.paymentMethod}`
                      ]}
                    </div>

                    {tx.note && (
                      <div className="tx-note">
                        {tx.note}
                      </div>
                    )}

                  </div>

                  <div className="tx-right">

                    <div
                      className={`tx-amount ${
                        tx.type ===
                        "gelir"
                          ? "amount-income"
                          : "amount-expense"
                      }`}
                    >
                      {tx.type ===
                      "gelir"
                        ? "+"
                        : "-"}
                      {formatAmount(
                        tx.amount,
                        tx.currency
                      )}
                    </div>

                    <div className="tx-try">
                      ≈{" "}
                      {formatAmount(
                        tx.amountTRY,
                        "TRY"
                      )}
                    </div>

                    <button
                      className="text-btn danger"
                      onClick={() =>
                        onDelete(
                          tx.id
                        )
                      }
                    >
                      {t.deleteBtn}
                    </button>

                  </div>

                </li>
              ))}
          </ul>
        )}

      </Section>
    </div>
  );
}

function VarlikTab({
  t,
  transactions,
  investments,
  rates,
  onDeleteInvestment,
  onRefreshRates
}) {
  const balances = {
    TRY: 0,
    USD: 0,
    EGP: 0
  };

  transactions.forEach(tx => {
    const value =
      tx.type === "gelir"
        ? Number(tx.amount)
        : -Number(tx.amount);

    balances[
      tx.currency
    ] += value;
  });

  const tryValue =
    balances.TRY +
    toTRY(
      balances.USD,
      "USD",
      rates
    ) +
    toTRY(
      balances.EGP,
      "EGP",
      rates
    );

  const investmentValue =
    investments.reduce(
      (sum, inv) =>
        sum +
        Number(inv.quantity) *
          Number(inv.priceTRY),
      0
    );

  const totalAssets =
    tryValue + investmentValue;

  return (
    <div className="tab-pane">

      <div className="networth-card">

        <div className="networth-label">
          {t.totalAssets}
        </div>

        <div className="networth-value">
          {formatAmount(
            totalAssets,
            "TRY"
          )}
        </div>

        <div className="networth-sub">
          USD ≈{" "}
          {formatAmount(
            fromTRY(
              totalAssets,
              "USD",
              rates
            ),
            "USD"
          )}
          {" · "}
          EGP ≈{" "}
          {formatAmount(
            fromTRY(
              totalAssets,
              "EGP",
              rates
            ),
            "EGP"
          )}
        </div>

      </div>

      <Section
        title={t.cashBankTitle}
      >

        {CURRENCIES.map(
          currency => (
            <div
              className="cash-row"
              key={currency}
            >

              <div className="cash-row-head">

                <span>
                  {t[
                    `cur_${currency}`
                  ]}
                </span>

                <strong>
                  {formatAmount(
                    balances[
                      currency
                    ],
                    currency
                  )}
                </strong>

              </div>

              <div className="cash-sub-row">
                <span>
                  {t.pay_cash}:{" "}
                  {formatAmount(
                    getPaymentBalance(
                      transactions,
                      "cash",
                      currency
                    ),
                    currency
                  )}
                </span>

                <span>
                  {t.pay_bank}:{" "}
                  {formatAmount(
                    getPaymentBalance(
                      transactions,
                      "bank",
                      currency
                    ),
                    currency
                  )}
                </span>

                <span>
                  {t.pay_instapay}:{" "}
                  {formatAmount(
                    getPaymentBalance(
                      transactions,
                      "instapay",
                      currency
                    ),
                    currency
                  )}
                </span>
              </div>

            </div>
          )
        )}

      </Section>

      <Section
        title={t.investmentsTitle}
      >

        {!investments.length ? (
          <EmptyState
            text={
              t.noInvestments
            }
          />
        ) : (
          <ul className="invest-list">

            {investments.map(
              inv => (
                <li
                  className="invest-row"
                  key={inv.id}
                >

                  <div>
                    <div className="invest-name">
                      {inv.name}
                    </div>

                    <div className="invest-meta">
                      {t[
                        `inv_${inv.type}`
                      ]}{" "}
                      ·{" "}
                      {inv.quantity}{" "}
                      {inv.unit}
                    </div>
                  </div>

                  <div className="invest-right">

                    <strong>
                      {formatAmount(
                        inv.quantity *
                          inv.priceTRY,
                        "TRY"
                      )}
                    </strong>

                    <button
                      className="text-btn danger"
                      onClick={() =>
                        onDeleteInvestment(
                          inv.id
                        )
                      }
                    >
                      {t.deleteBtn}
                    </button>

                  </div>

                </li>
              )
            )}

          </ul>
        )}

        {investments.length > 0 && (
          <div className="invest-total">
            <span>
              {t.investTotal}
            </span>

            <strong>
              {formatAmount(
                investmentValue,
                "TRY"
              )}
            </strong>
          </div>
        )}

      </Section>

      <Section
        title={t.ratesTitle}
        right={
          <button
            className="icon-btn"
            onClick={
              onRefreshRates
            }
          >
            ↻
          </button>
        }
      >

        <div className="rate-note">
          {t.rateManual}
        </div>

        <div className="rate-field">
          <label className="field">
            <span>
              1 USD {t.rateSuffix}
            </span>

            <input
              type="number"
              value={rates.USD}
              readOnly
            />
          </label>
        </div>

        <div className="rate-field">
          <label className="field">
            <span>
              1 EGP {t.rateSuffix}
            </span>

            <input
              type="number"
              value={rates.EGP}
              readOnly
            />
          </label>
        </div>

      </Section>
    </div>
  );
}

function getPaymentBalance(
  transactions,
  payment,
  currency
) {
  return transactions
    .filter(
      x =>
        x.paymentMethod ===
          payment &&
        x.currency ===
          currency
    )
    .reduce(
      (sum, x) =>
        sum +
        (x.type === "gelir"
          ? Number(x.amount)
          : -Number(x.amount)),
      0
    );
}

function SabitTab({
  t,
  recurring,
  pendingRecurring,
  onConfirm,
  onDelete,
  onToggle
}) {
  return (
    <div className="tab-pane">

      <Section
        title={t.thisMonthApprovals}
      >

        {!pendingRecurring.length ? (
          <EmptyState
            text={t.noRecurring}
          />
        ) : (
          <>
            <ul className="recurring-list">

              {pendingRecurring.map(
                item => (
                  <li
                    key={item.id}
                    className={`recurring-row selectable ${
                      item.selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      onToggle(
                        item.id
                      )
                    }
                  >

                    <span className="check-box">
                      {item.selected
                        ? "✓"
                        : ""}
                    </span>

                    <div className="recurring-main">

                      <div className="recurring-desc">
                        {item.description}
                      </div>

                      <div className="recurring-meta">
                        {t[
                          `cat_${item.category}`
                        ]}{" "}
                        ·{" "}
                        {t[
                          `pay_${item.paymentMethod}`
                        ]}
                      </div>

                    </div>

                    <div className="recurring-amount">
                      {formatAmount(
                        item.amount,
                        item.currency
                      )}
                    </div>

                  </li>
                )
              )}

            </ul>

            <button
              className="btn btn-primary full-width"
              onClick={
                onConfirm
              }
            >
              {t.confirmSelected}
            </button>
          </>
        )}

      </Section>

      <Section
        title={t.definedRecurring}
      >

        {!recurring.length ? (
          <EmptyState
            text={t.noRecurring}
          />
        ) : (
          <ul className="recurring-list">

            {recurring.map(
              item => (
                <li
                  className="recurring-row"
                  key={item.id}
                >

                  <div className="recurring-main">

                    <div className="recurring-desc">
                      {item.description}
                    </div>

                    <div className="recurring-meta">
                      {t.everyMonthDay(
                        item.dayOfMonth
                      )}{" "}
                      ·{" "}
                      {t[
                        `cat_${item.category}`
                      ]}{" "}
                      ·{" "}
                      {t[
                        `pay_${item.paymentMethod}`
                      ]}
                    </div>

                  </div>

                  <div className="recurring-amount">
                    {item.type ===
                    "gelir"
                      ? "+"
                      : "-"}
                    {formatAmount(
                      item.amount,
                      item.currency
                    )}
                  </div>

                  <button
                    className="text-btn danger"
                    onClick={() =>
                      onDelete(
                        item.id
                      )
                    }
                  >
                    {t.deleteBtn}
                  </button>

                </li>
              )
            )}

          </ul>
        )}

      </Section>
    </div>
  );
}

function TransactionForm({
  t,
  onClose,
  onSave
}) {
  const [type, setType] =
    useState("gider");

  const [date, setDate] =
    useState(todayStr());

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [currency, setCurrency] =
    useState("TRY");

  const [category, setCategory] =
    useState("rent");

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  const [note, setNote] =
    useState("");

  const [error, setError] =
    useState("");

  const categoryOptions =
    CATEGORY_KEYS[
      type === "gelir"
        ? "income"
        : "expense"
    ];

  useEffect(() => {
    if (
      !categoryOptions.includes(
        category
      )
    ) {
      setCategory(
        categoryOptions[0]
      );
    }
  }, [type]);

  function handleSubmit(e) {
    e.preventDefault();

    const parsed =
      parseFloat(
        String(amount)
          .replace(",", ".")
      );

    if (!description.trim()) {
      setError(t.errDesc);
      return;
    }

    if (!parsed || parsed <= 0) {
      setError(t.errAmount);
      return;
    }

    onSave({
      id:
        "tx-" +
        Date.now(),

      date,

      type,

      description:
        description.trim(),

      amount: parsed,

      currency,

      category,

      paymentMethod,

      note:
        note.trim(),

      amountTRY:
        toTRY(
          parsed,
          currency,
          FALLBACK_RATES
        )
    });
  }

  return (
    <ModalShell
      title={t.newTxTitle}
      onClose={onClose}
      closeLabel={
        t.closeAria
      }
    >

      <form
        className="modal-form"
        onSubmit={
          handleSubmit
        }
      >

        <div className="type-toggle">

          <button
            type="button"
            className={`toggle-btn ${
              type === "gelir"
                ? "toggle-active-income"
                : ""
            }`}
            onClick={() =>
              setType("gelir")
            }
          >
            {t.income}
          </button>

          <button
            type="button"
            className={`toggle-btn ${
              type === "gider"
                ? "toggle-active-expense"
                : ""
            }`}
            onClick={() =>
              setType("gider")
            }
          >
            {t.expense}
          </button>

        </div>

        <label className="field">
          <span>
            {t.dateLabel}
          </span>

          <input
            type="date"
            value={date}
            onChange={e =>
              setDate(
                e.target.value
              )
            }
          />
        </label>

        <label className="field">
          <span>
            {t.descLabel}
          </span>

          <input
            type="text"
            placeholder={
              type === "gelir"
                ? t.descPlaceholderIncome
                : t.descPlaceholderExpense
            }
            value={
              description
            }
            onChange={e =>
              setDescription(
                e.target.value
              )
            }
          />
        </label>

        <div className="two-col">

          <label className="field">
            <span>
              {t.amountLabel}
            </span>

            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={e =>
                setAmount(
                  e.target.value
                )
              }
            />
          </label>

          <label className="field">
            <span>
              {t.currencyLabel}
            </span>

            <select
              value={currency}
              onChange={e =>
                setCurrency(
                  e.target.value
                )
              }
            >
              {CURRENCIES.map(
                c => (
                  <option
                    key={c}
                    value={c}
                  >
                    {c}
                  </option>
                )
              )}
            </select>
          </label>

        </div>

        <label className="field">
          <span>
            {t.categoryLabel}
          </span>

          <select
            value={category}
            onChange={e =>
              setCategory(
                e.target.value
              )
            }
          >
            {categoryOptions.map(
              c => (
                <option
                  key={c}
                  value={c}
                >
                  {t[
                    `cat_${c}`
                  ]}
                </option>
              )
            )}
          </select>
        </label>

        <label className="field">
          <span>
            {t.paymentLabel}
          </span>

          <select
            value={
              paymentMethod
            }
            onChange={e =>
              setPaymentMethod(
                e.target.value
              )
            }
          >
            {PAYMENT_KEYS.map(
              key => (
                <option
                  key={key}
                  value={key}
                >
                  {t[
                    `pay_${key}`
                  ]}
                </option>
              )
            )}
          </select>
        </label>

        <label className="field">
          <span>
            {t.noteLabel}
          </span>

          <input
            type="text"
            value={note}
            onChange={e =>
              setNote(
                e.target.value
              )
            }
          />
        </label>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="modal-actions">

          <button
            type="button"
            className="btn btn-ghost"
            onClick={
              onClose
            }
          >
            {t.cancelBtn}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            {t.saveBtn}
          </button>

        </div>

      </form>
    </ModalShell>
  );
}

function RecurringForm({
  t,
  onClose,
  onSave
}) {
  const [type, setType] =
    useState("gider");

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [currency, setCurrency] =
    useState("TRY");

  const [category, setCategory] =
    useState("rent");

  const [paymentMethod, setPaymentMethod] =
    useState("bank");

  const [dayOfMonth, setDayOfMonth] =
    useState("1");

  const [error, setError] =
    useState("");

  const options =
    CATEGORY_KEYS[
      type === "gelir"
        ? "income"
        : "expense"
    ];

  function handleSubmit(e) {
    e.preventDefault();

    const parsed =
      parseFloat(
        String(amount)
          .replace(",", ".")
      );

    const day =
      Number(dayOfMonth);

    if (!description.trim()) {
      setError(t.errDesc);
      return;
    }

    if (!parsed || parsed <= 0) {
      setError(t.errAmount);
      return;
    }

    if (
      !day ||
      day < 1 ||
      day > 31
    ) {
      setError(t.errDay);
      return;
    }

    onSave({
      id:
        "rec-" +
        Date.now(),

      description:
        description.trim(),

      amount: parsed,

      currency,

      type,

      category,

      paymentMethod,

      dayOfMonth: day
    });
  }

  return (
    <ModalShell
      title={t.recurringTitle}
      onClose={onClose}
      closeLabel={
        t.closeAria
      }
    >

      <form
        className="modal-form"
        onSubmit={
          handleSubmit
        }
      >

        <div className="type-toggle">

          <button
            type="button"
            className={`toggle-btn ${
              type === "gelir"
                ? "toggle-active-income"
                : ""
            }`}
            onClick={() =>
              setType("gelir")
            }
          >
            {t.income}
          </button>

          <button
            type="button"
            className={`toggle-btn ${
              type === "gider"
                ? "toggle-active-expense"
                : ""
            }`}
            onClick={() =>
              setType("gider")
            }
          >
            {t.expense}
          </button>

        </div>

        <label className="field">
          <span>
            {t.descLabel}
          </span>

          <input
            type="text"
            placeholder={
              t.recurringDescPlaceholder
            }
            value={
              description
            }
            onChange={e =>
              setDescription(
                e.target.value
              )
            }
          />
        </label>

        <div className="two-col">

          <label className="field">
            <span>
              {t.amountLabel}
            </span>

            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={e =>
                setAmount(
                  e.target.value
                )
              }
            />
          </label>

          <label className="field">
            <span>
              {t.currencyLabel}
            </span>

            <select
              value={currency}
              onChange={e =>
                setCurrency(
                  e.target.value
                )
              }
            >
              {CURRENCIES.map(
                c => (
                  <option
                    key={c}
                    value={c}
                  >
                    {c}
                  </option>
                )
              )}
            </select>
          </label>

        </div>

        <label className="field">
          <span>
            {t.categoryLabel}
          </span>

          <select
            value={category}
            onChange={e =>
              setCategory(
                e.target.value
              )
            }
          >
            {options.map(
              c => (
                <option
                  key={c}
                  value={c}
                >
                  {t[
                    `cat_${c}`
                  ]}
                </option>
              )
            )}
          </select>
        </label>

        <label className="field">
          <span>
            {t.paymentLabel}
          </span>

          <select
            value={
              paymentMethod
            }
            onChange={e =>
              setPaymentMethod(
                e.target.value
              )
            }
          >
            {PAYMENT_KEYS.map(
              key => (
                <option
                  key={key}
                  value={key}
                >
                  {t[
                    `pay_${key}`
                  ]}
                </option>
              )
            )}
          </select>
        </label>

        <label className="field">
          <span>
            {t.dayOfMonthLabel}
          </span>

          <input
            type="number"
            min="1"
            max="31"
            value={dayOfMonth}
            onChange={e =>
              setDayOfMonth(
                e.target.value
              )
            }
          />
        </label>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="modal-actions">

          <button
            type="button"
            className="btn btn-ghost"
            onClick={
              onClose
            }
          >
            {t.cancelBtn}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            {t.saveBtn}
          </button>

        </div>

      </form>
    </ModalShell>
  );
}

function InvestmentForm({
  t,
  onClose,
  onSave,
  rates
}) {
  const [investType, setInvestType] =
    useState("gold");

  const [name, setName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [currency, setCurrency] =
    useState("USD");

  const [error, setError] =
    useState("");

  const unit =
    investType === "gold"
      ? t.unit_gram
      : investType === "forex"
      ? currency
      : t.unit_piece;

  useEffect(() => {
    if (
      investType === "forex"
    ) {
      const rate =
        currency === "USD"
          ? rates.USD
          : rates.EGP;

      setPrice(
        String(rate)
      );
    }
  }, [
    investType,
    currency,
    rates
  ]);

  function handleSubmit(e) {
    e.preventDefault();

    const q =
      parseFloat(
        String(quantity)
          .replace(",", ".")
      );

    const p =
      parseFloat(
        String(price)
          .replace(",", ".")
      );

    if (!name.trim()) {
      setError(t.errName);
      return;
    }

    if (!q || q <= 0) {
      setError(t.errQty);
      return;
    }

    if (!p || p <= 0) {
      setError(t.errPrice);
      return;
    }

    onSave({
      id:
        "inv-" +
        Date.now(),

      name:
        name.trim(),

      type:
        investType,

      quantity:
        q,

      unit,

      currency:
        investType ===
        "forex"
          ? currency
          : "TRY",

      priceTRY:
        investType ===
        "forex"
          ? p
          : p
    });
  }

  let placeholder =
    t.namePlaceholderOther;

  if (
    investType === "gold"
  ) {
    placeholder =
      t.namePlaceholderGold;
  }

  if (
    investType === "stocks"
  ) {
    placeholder =
      t.namePlaceholderStock;
  }

  if (
    investType === "crypto"
  ) {
    placeholder =
      t.namePlaceholderCrypto;
  }

  return (
    <ModalShell
      title={t.investFormTitle}
      onClose={onClose}
      closeLabel={
        t.closeAria
      }
    >

      <form
        className="modal-form"
        onSubmit={
          handleSubmit
        }
      >

        <label className="field">
          <span>
            {t.investTypeLabel}
          </span>

          <select
            value={
              investType
            }
            onChange={e =>
              setInvestType(
                e.target.value
              )
            }
          >
            {INVESTMENT_TYPE_KEYS.map(
              key => (
                <option
                  key={key}
                  value={key}
                >
                  {t[
                    `inv_${key}`
                  ]}
                </option>
              )
            )}
          </select>
        </label>

        {investType ===
          "forex" && (
          <label className="field">
            <span>
              {t.whichCurrency}
            </span>

            <select
              value={
                currency
              }
              onChange={e =>
                setCurrency(
                  e.target.value
                )
              }
            >
              <option value="USD">
                USD
              </option>

              <option value="EGP">
                EGP
              </option>
            </select>
          </label>
        )}

        <label className="field">
          <span>
            {t.nameLabel}
          </span>

          <input
            type="text"
            placeholder={
              placeholder
            }
            value={name}
            onChange={e =>
              setName(
                e.target.value
              )
            }
          />
        </label>

        <div className="two-col">

          <label className="field">
            <span>
              {t.quantityLabel} (
              {unit})
            </span>

            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={
                quantity
              }
              onChange={e =>
                setQuantity(
                  e.target.value
                )
              }
            />
          </label>

          <label className="field">
            <span>
              {t.unitPriceLabel}
            </span>

            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={price}
              onChange={e =>
                setPrice(
                  e.target.value
                )
              }
            />
          </label>

        </div>

        {quantity &&
          price && (
            <div className="preview-line">
              {t.previewTotal}{" "}
              {formatAmount(
                Number(
                  quantity
                ) *
                  Number(
                    price
                  ),
                "TRY"
              )}
            </div>
          )}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="modal-actions">

          <button
            type="button"
            className="btn btn-ghost"
            onClick={
              onClose
            }
          >
            {t.cancelBtn}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            {t.saveBtn}
          </button>

        </div>

      </form>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  closeLabel,
  children
}) {
  return (
    <div
      className="modal-backdrop"
      onClick={
        onClose
      }
    >
      <div
        className="modal"
        onClick={e =>
          e.stopPropagation()
        }
      >

        <div className="modal-header">

          <h2>
            {title}
          </h2>

          <button
            className="icon-btn"
            onClick={
              onClose
            }
            aria-label={
              closeLabel
            }
          >
            ×
          </button>

        </div>

        {children}

      </div>
    </div>
  );
}

function FinansimApp() {
  const [lang, setLang] =
    useState(
      () =>
        localStorage.getItem(
          STORAGE_KEYS.language
        ) || "tr"
    );

  const [tab, setTab] =
    useState("ozet");

  const [transactions, setTransactions] =
    useState(
      () =>
        load(
          STORAGE_KEYS.transactions,
          []
        )
    );

  const [investments, setInvestments] =
    useState(
      () =>
        load(
          STORAGE_KEYS.investments,
          []
        )
    );

  const [recurring, setRecurring] =
    useState(
      () =>
        load(
          STORAGE_KEYS.recurring,
          []
        )
    );

  const [rates, setRates] =
    useState(
      () =>
        load(
          STORAGE_KEYS.rates,
          FALLBACK_RATES
        )
    );

  const [fromDate, setFromDate] =
    useState(
      startOfMonth()
    );

  const [toDate, setToDate] =
    useState(todayStr());

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [currencyFilter, setCurrencyFilter] =
    useState("ALL");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [modal, setModal] =
    useState(null);

  const [selectedRecurring, setSelectedRecurring] =
    useState([]);

  const t =
    T[lang] || T.tr;

  useEffect(() => {
    save(
      STORAGE_KEYS.transactions,
      transactions
    );
  }, [transactions]);

  useEffect(() => {
    save(
      STORAGE_KEYS.investments,
      investments
    );
  }, [investments]);

  useEffect(() => {
    save(
      STORAGE_KEYS.recurring,
      recurring
    );
  }, [recurring]);

  useEffect(() => {
    save(
      STORAGE_KEYS.rates,
      rates
    );
  }, [rates]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.language,
      lang
    );
  }, [lang]);

  const filtered =
    useMemo(() => {
      return transactions.filter(
        tx => {
          const dateOK =
            (!fromDate ||
              tx.date >=
                fromDate) &&
            (!toDate ||
              tx.date <=
                toDate);

          const typeOK =
            typeFilter ===
              "ALL" ||
            tx.type ===
              typeFilter;

          const categoryOK =
            categoryFilter ===
              "ALL" ||
            tx.category ===
              categoryFilter;

          return (
            dateOK &&
            typeOK &&
            categoryOK
          );
        }
      );
    }, [
      transactions,
      fromDate,
      toDate,
      typeFilter,
      categoryFilter
    ]);

  const totals =
    useMemo(() => {
      let gelir = 0;
      let gider = 0;

      filtered.forEach(
        tx => {
          if (
            tx.type ===
            "gelir"
          ) {
            gelir +=
              Number(
                tx.amountTRY
              );
          } else {
            gider +=
              Number(
                tx.amountTRY
              );
          }
        }
      );

      return {
        gelir,
        gider,
        net:
          gelir - gider
      };
    }, [filtered]);

  const pieData =
    useMemo(() => {
      const map = {};

      filtered
        .filter(
          x =>
            x.type ===
            "gider"
        )
        .forEach(x => {
          map[x.category] =
            (map[
              x.category
            ] || 0) +
            Number(
              x.amountTRY
            );
        });

      return Object.entries(
        map
      )
        .map(
          ([key, value]) => ({
            key,
            value
          })
        )
        .sort(
          (a, b) =>
            b.value -
            a.value
        );
    }, [filtered]);

  const trendData =
    useMemo(() => {
      const days = [];

      const start =
        new Date(
          fromDate +
            "T00:00:00"
        );

      const end =
        new Date(
          toDate +
            "T00:00:00"
        );

      const maxDays = 31;

      let cursor =
        new Date(start);

      while (
        cursor <= end &&
        days.length <
          maxDays
      ) {
        const date =
          cursor
            .toISOString()
            .slice(0, 10);

        const dayTx =
          filtered.filter(
            x =>
              x.date ===
              date
          );

        days.push({
          label:
            formatDateTR(
              date
            ).slice(
              0,
              5
            ),

          income:
            dayTx
              .filter(
                x =>
                  x.type ===
                  "gelir"
              )
              .reduce(
                (sum, x) =>
                  sum +
                  Number(
                    x.amountTRY
                  ),
                0
              ),

          expense:
            dayTx
              .filter(
                x =>
                  x.type ===
                  "gider"
              )
              .reduce(
                (sum, x) =>
                  sum +
                  Number(
                    x.amountTRY
                  ),
                0
              )
        });

        cursor.setDate(
          cursor.getDate() +
            1
        );
      }

      return days;
    }, [
      filtered,
      fromDate,
      toDate
    ]);

  const pendingRecurring =
    useMemo(() => {
      const currentMonth =
        todayStr().slice(
          0,
          7
        );

      return recurring.map(
        item => ({
          ...item,
          selected:
            selectedRecurring.includes(
              item.id
            ),
          month:
            currentMonth
        })
      );
    }, [
      recurring,
      selectedRecurring
    ]);

  function changeRange(
    type
  ) {
    const today =
      todayStr();

    if (
      type === "today"
    ) {
      setFromDate(
        today
      );
      setToDate(
        today
      );
    }

    if (
      type === "week"
    ) {
      setFromDate(
        startOfWeek()
      );
      setToDate(
        today
      );
    }

    if (
      type === "month"
    ) {
      setFromDate(
        startOfMonth()
      );
      setToDate(
        today
      );
    }

    if (
      type === "year"
    ) {
      setFromDate(
        startOfYear()
      );
      setToDate(
        today
      );
    }

    if (
      type === "all"
    ) {
      if (
        transactions.length
      ) {
        const dates =
          transactions.map(
            x => x.date
          );

        setFromDate(
          dates.sort()[0]
        );

        setToDate(
          dates.sort()[
            dates.length - 1
          ]
        );
      }
    }
  }

  function addTransaction(
    tx
  ) {
    const amountTRY =
      toTRY(
        tx.amount,
        tx.currency,
        rates
      );

    setTransactions(
      prev => [
        ...prev,
        {
          ...tx,
          amountTRY
        }
      ]
    );

    setModal(null);
  }

  function deleteTransaction(
    id
  ) {
    if (
      !confirm(
        lang === "tr"
          ? "Bu işlemi silmek istediğine emin misin?"
          : "Delete this transaction?"
      )
    ) {
      return;
    }

    setTransactions(
      prev =>
        prev.filter(
          x =>
            x.id !== id
        )
    );
  }

  function addInvestment(
    investment
  ) {
    setInvestments(
      prev => [
        ...prev,
        investment
      ]
    );

    setModal(null);
  }

  function deleteInvestment(
    id
  ) {
    setInvestments(
      prev =>
        prev.filter(
          x =>
            x.id !== id
        )
    );
  }

  function addRecurring(
    item
  ) {
    setRecurring(
      prev => [
        ...prev,
        item
      ]
    );

    setModal(null);
  }

  function deleteRecurring(
    id
  ) {
    setRecurring(
      prev =>
        prev.filter(
          x =>
            x.id !== id
        )
    );
  }

  function toggleRecurring(
    id
  ) {
    setSelectedRecurring(
      prev =>
        prev.includes(id)
          ? prev.filter(
              x =>
                x !== id
            )
          : [
              ...prev,
              id
            ]
    );
  }

  function confirmRecurring() {
    const selected =
      recurring.filter(
        item =>
          selectedRecurring.includes(
            item.id
          )
      );

    const date =
      todayStr();

    const newTransactions =
      selected.map(
        item => ({
          id:
            "tx-" +
            Date.now() +
            "-" +
            item.id,

          date,

          type:
            item.type,

          description:
            item.description,

          amount:
            item.amount,

          currency:
            item.currency,

          category:
            item.category,

          paymentMethod:
            item.paymentMethod,

          note:
            "Sabit ödeme",

          amountTRY:
            toTRY(
              item.amount,
              item.currency,
              rates
            )
        })
      );

    if (
      newTransactions.length
    ) {
      setTransactions(
        prev => [
          ...prev,
          ...newTransactions
        ]
      );
    }

    setSelectedRecurring(
      []
    );
  }

  function exportData() {
    const data = {
      transactions,
      investments,
      recurring,
      rates,
      exportedAt:
        new Date().toISOString()
    };

    const blob =
      new Blob(
        [
          JSON.stringify(
            data,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      "finansim-yedek.json";

    a.click();

    URL.revokeObjectURL(
      url
    );
  }

  function printPDF() {
    window.print();
  }

  function refreshRates() {
    /*
      GitHub Pages üzerinde dış API kullanmadan
      güvenli çalışması için şimdilik mevcut
      manuel kurları koruyoruz.

      Daha sonraki aşamada gerçek zamanlı
      USD/TRY ve EGP/TRY API bağlantısı eklenebilir.
    */

    alert(
      lang === "tr"
        ? "Kur sistemi hazır. Güncel API bağlantısını bir sonraki aşamada ekleyebiliriz."
        : "The exchange-rate system is ready. A live API connection can be added next."
    );
  }

  const categoryOptions = [
    ...CATEGORY_KEYS.income,
    ...CATEGORY_KEYS.expense
  ];

  return (
    <div
      className={`app-shell ${
        lang === "ar"
          ? "rtl"
          : ""
      }`}
    >

      <div
        className={`phone ${
          lang === "ar"
            ? "rtl"
            : ""
        }`}
      >

        <header className="topbar">

          <div className="brand">
            Finans<span>ım</span>
          </div>

          <div className="topbar-right">

            <LangSwitch
              lang={lang}
              onChange={
                setLang
              }
            />

            <button
              className="btn-pdf"
              onClick={
                printPDF
              }
            >
              {t.pdfBtn}
            </button>

          </div>

        </header>

        <main
          className="tab-content"
        >

          {tab ===
            "ozet" && (
            <>

              <div className="chip-row scrollable">

                <QuickRangeButton
                  label={
                    t.todayChip
                  }
                  active={
                    fromDate ===
                      todayStr() &&
                    toDate ===
                      todayStr()
                  }
                  onClick={() =>
                    changeRange(
                      "today"
                    )
                  }
                />

                <QuickRangeButton
                  label={
                    t.weekChip
                  }
                  onClick={() =>
                    changeRange(
                      "week"
                    )
                  }
                />

                <QuickRangeButton
                  label={
                    t.monthChip
                  }
                  active={
                    fromDate ===
                    startOfMonth()
                  }
                  onClick={() =>
                    changeRange(
                      "month"
                    )
                  }
                />

                <QuickRangeButton
                  label={
                    t.yearChip
                  }
                  onClick={() =>
                    changeRange(
                      "year"
                    )
                  }
                />

                <QuickRangeButton
                  label={
                    t.allChip
                  }
                  onClick={() =>
                    changeRange(
                      "all"
                    )
                  }
                />

                <button
                  className={`chip ${
                    filterOpen
                      ? "chip-active"
                      : ""
                  }`}
                  onClick={() =>
                    setFilterOpen(
                      !filterOpen
                    )
                  }
                >
                  {t.filterToggle} ▼
                </button>

              </div>

              {filterOpen && (
                <div className="filter-drawer">

                  <label className="field-inline">
                    <span>
                      {t.startDate}
                    </span>

                    <input
                      type="date"
                      value={
                        fromDate
                      }
                      onChange={e =>
                        setFromDate(
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label className="field-inline">
                    <span>
                      {t.endDate}
                    </span>

                    <input
                      type="date"
                      value={
                        toDate
                      }
                      onChange={e =>
                        setToDate(
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label className="field-inline">
                    <span>
                      {t.txType}
                    </span>

                    <select
                      value={
                        typeFilter
                      }
                      onChange={e =>
                        setTypeFilter(
                          e.target.value
                        )
                      }
                    >
                      <option value="ALL">
                        {t.allTypes}
                      </option>

                      <option value="gelir">
                        {t.income}
                      </option>

                      <option value="gider">
                        {t.expense}
                      </option>
                    </select>
                  </label>

                  <label className="field-inline">
                    <span>
                      {t.category}
                    </span>

                    <select
                      value={
                        categoryFilter
                      }
                      onChange={e =>
                        setCategoryFilter(
                          e.target.value
                        )
                      }
                    >
                      <option value="ALL">
                        {t.allCategories}
                      </option>

                      {categoryOptions.map(
                        key => (
                          <option
                            key={key}
                            value={key}
                          >
                            {t[
                              `cat_${key}`
                            ]}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                </div>
              )}

              <OzetTab
                t={t}
                filtered={
                  filtered
                }
                totals={
                  totals
                }
                pieData={
                  pieData
                }
                trendData={
                  trendData
                }
              />

            </>
          )}

          {tab ===
            "islemler" && (
            <IslemlerTab
              t={t}
              filtered={
                filtered
              }
              currencyFilter={
                currencyFilter
              }
              setCurrencyFilter={
                setCurrencyFilter
              }
              onDelete={
                deleteTransaction
              }
            />
          )}

          {tab ===
            "varlik" && (
            <VarlikTab
              t={t}
              transactions={
                transactions
              }
              investments={
                investments
              }
              rates={rates}
              onDeleteInvestment={
                deleteInvestment
              }
              onRefreshRates={
                refreshRates
              }
            />
          )}

          {tab ===
            "sabit" && (
            <SabitTab
              t={t}
              recurring={
                recurring
              }
              pendingRecurring={
                pendingRecurring
              }
              onConfirm={
                confirmRecurring
              }
              onDelete={
                deleteRecurring
              }
              onToggle={
                toggleRecurring
              }
            />
          )}

        </main>

        <button
          className="fab no-print"
          onClick={() => {
            if (
              tab ===
              "islemler"
            ) {
              setModal(
                "transaction"
              );
            } else if (
              tab ===
              "varlik"
            ) {
              setModal(
                "investment"
              );
            } else if (
              tab ===
              "sabit"
            ) {
              setModal(
                "recurring"
              );
            } else {
              setModal(
                "transaction"
              );
            }
          }}
          aria-label={
            t.addAria
          }
        >
          +
        </button>

        <nav
          className="bottom-nav no-print"
        >

          <NavButton
            label={
              t.navOzet
            }
            active={
              tab ===
              "ozet"
            }
            onClick={() =>
              setTab("ozet")
            }
          />

          <NavButton
            label={
              t.navIslemler
            }
            active={
              tab ===
              "islemler"
            }
            onClick={() =>
              setTab(
                "islemler"
              )
            }
          />

          <NavButton
            label={
              t.navVarlik
            }
            active={
              tab ===
              "varlik"
            }
            onClick={() =>
              setTab(
                "varlik"
              )
            }
          />

          <NavButton
            label={
              t.navSabit
            }
            active={
              tab ===
              "sabit"
            }
            onClick={() =>
              setTab(
                "sabit"
              )
            }
          />

        </nav>

        {modal ===
          "transaction" && (
          <TransactionForm
            t={t}
            onClose={() =>
              setModal(null)
            }
            onSave={
              addTransaction
            }
          />
        )}

        {modal ===
          "investment" && (
          <InvestmentForm
            t={t}
            rates={rates}
            onClose={() =>
              setModal(null)
            }
            onSave={
              addInvestment
            }
          />
        )}

        {modal ===
          "recurring" && (
          <RecurringForm
            t={t}
            onClose={() =>
              setModal(null)
            }
            onSave={
              addRecurring
            }
          />
        )}

      </div>

    </div>
  );
}

const root =
  ReactDOM.createRoot(
    document.getElementById(
      "root"
    )
  );

root.render(
  <FinansimApp />
);