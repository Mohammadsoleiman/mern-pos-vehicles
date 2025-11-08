// src/pages/admin/Reports.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  BarChart, Bar,
  PieChart, Pie,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

import styles from "../../styles/adminReports.module.css";

export default function AdminReports() {
  const [summary, setSummary] = useState({});
  const [topCustomers, setTopCustomers] = useState([]);
  const [recent, setRecent] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartSales, setChartSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      axiosClient.get("/reports/summary"),
      axiosClient.get("/reports/top-customers?limit=5"),
      axiosClient.get("/reports/recent-transactions?limit=8"),
      axiosClient.get("/reports/admin/timeseries"),
      axiosClient.get("/reports/admin/sales-trend"),
    ])
      .then(([sum, tc, rt, ts, st]) => {
        setSummary(sum?.data ?? {});
        setTopCustomers(tc?.data ?? []);
        setRecent(rt?.data ?? []);
        setChartData(ts?.data ?? []);
        setChartSales(st?.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Improved print: include a small print CSS and the #print-area content
  const handlePrint = () => {
    const printContents = document.getElementById("print-area").innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700,scrollbars=yes");

    // minimal print CSS that matches module styles (enough for good printed result)
    const printCss = `
      body { font-family: Arial, Helvetica, sans-serif; color:#000; padding:20px; }
      h2 { font-size:18px; margin:10px 0 6px; }
      table { width:100%; border-collapse: collapse; margin-top:8px; }
      thead tr { background: #6a5acd; color: #fff; }
      th, td { padding:8px; border: 1px solid #000; font-size:13px; text-align:left; }
      #summary-table th, #summary-table td { text-align:center; font-weight:600; }
      /* avoid printing shadows/rounded corners which may not render well */
      body * { box-shadow: none !important; }
      @media print {
        a[href]:after { content: none !important; }
      }
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Admin Report</title>
          <style>${printCss}</style>
        </head>
        <body>
          <div style="max-width:1100px; margin: 0 auto;">
            ${printContents}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    // Wait a tick to allow render (most browsers handle immediately)
    printWindow.focus();
    printWindow.print();
    // Optionally close window:
    // printWindow.close();
  };

  if (loading) return <div className={styles.pageLoading}>Loading...</div>;

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={`${styles.pageHeader} ${styles.noPrint || ""}`}>
        <h1>Admin Reports</h1>
        <button onClick={handlePrint} className={styles.printBtn}>🖨️ Print Report</button>
      </div>

      {/* CHARTS (not printed) */}
      <div className={`${styles.chartsRow} ${styles.noPrint || ""}`}>
        <div className={styles.chartCard}>
          <h2>Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#4CAF50" />
              <Bar dataKey="expense" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h2>Sales Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartSales}
                dataKey="sales"
                nameKey="month"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                fill="#6A5ACD"
              />
              <Tooltip formatter={(v) => `${v} sale(s)`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRINT AREA */}
      <div id="print-area">
        <h2>Financial Summary</h2>
        <table id="summary-table" className={styles.printTable}>
          <thead>
            <tr>
              <th>Total Income</th>
              <th>Total Expenses</th>
              <th>Net Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${summary.totalIncome ?? 0}</td>
              <td>${summary.totalExpenses ?? 0}</td>
              <td>${summary.netProfit ?? 0}</td>
            </tr>
          </tbody>
        </table>

        <h2>Top Customers</h2>
        <table className={styles.printTable}>
          <thead>
            <tr><th>#</th><th>Customer</th><th >Purchases</th><th >Total Spent</th></tr>
          </thead>
          <tbody>
            {topCustomers.map((c, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td style={{textAlign:'left'}}>{c.purchases}</td>
                <td style={{textAlign:'left'}}>${c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Recent Transactions</h2>
        <table className={styles.printTable}>
          <thead>
            <tr><th>Date</th><th>Customer</th><th>Vehicle</th><th style={{textAlign:'right'}}>Amount</th><th>Method</th></tr>
          </thead>
          <tbody>
            {recent.map((t, i) => (
              <tr key={i}>
                <td>{t.date}</td>
                <td>{t.customer}</td>
                <td>{t.vehicle ?? 'N/A'}</td>
                <td style={{textAlign:'right'}}>${t.amount}</td>
                <td>{t.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
