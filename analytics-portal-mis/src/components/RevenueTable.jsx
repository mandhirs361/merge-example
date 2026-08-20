import {
  formatCurrency,
  formatPercent,
  getRegionalRevenue,
} from "../services/misService";
import "./revenue-table.css";

export default function RevenueTable({ rows = getRegionalRevenue() }) {
  return (
    <div className="mis-table-wrap">
      <table className="mis-table">
        <thead>
          <tr>
            <th>Region</th>
            <th>Revenue</th>
            <th>Target</th>
            <th>Orders</th>
            <th>Attainment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.region}>
              <td>{row.region}</td>
              <td>{formatCurrency(row.revenue)}</td>
              <td>{formatCurrency(row.target)}</td>
              <td>{row.orders.toLocaleString("en-US")}</td>
              <td>
                <span
                  className={`mis-pill mis-pill--${row.attainment >= 1 ? "ok" : "warn"}`}
                >
                  {formatPercent(row.attainment)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
