// Fake data layer for the MIS domain. Exposed over Module Federation so the host
// can reuse the same numbers without duplicating the domain logic.

const REGIONS = [
  { region: "North", revenue: 482300, target: 450000, orders: 1284 },
  { region: "South", revenue: 391750, target: 420000, orders: 1097 },
  { region: "East", revenue: 528900, target: 500000, orders: 1476 },
  { region: "West", revenue: 274600, target: 300000, orders: 812 },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function getRegionalRevenue() {
  return REGIONS.map((row) => ({
    ...row,
    attainment: row.revenue / row.target,
  }));
}

export function getKpis() {
  const rows = getRegionalRevenue();
  const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const target = rows.reduce((sum, row) => sum + row.target, 0);
  const orders = rows.reduce((sum, row) => sum + row.orders, 0);

  return [
    {
      id: "revenue",
      label: "Total revenue",
      value: currency.format(revenue),
      delta: 8.4,
    },
    {
      id: "attainment",
      label: "Target attainment",
      value: formatPercent(revenue / target),
      delta: 2.1,
    },
    {
      id: "orders",
      label: "The Orders",
      value: orders.toLocaleString("en-US"),
      delta: -1.6,
    },
    {
      id: "aov",
      label: "Avg. order value",
      value: currency.format(revenue / orders),
      delta: 4.9,
    },
  ];
}

export function formatCurrency(value) {
  return currency.format(value);
}

export function formatPercent(ratio) {
  return `${(ratio * 100).toFixed(1)}%`;
}
