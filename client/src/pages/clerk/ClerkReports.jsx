// src/pages/clerk/ClerkReports.jsx
import React, { useContext, useState, useEffect } from 'react';
import { SalesContext } from '../../context/clerk/SalesContext';
import { VehicleContext } from '../../context/clerk/VehicleContext';
import { CustomerContext } from '../../context/clerk/CustomerContext';
import { 
  BarChart3, TrendingUp, Download, DollarSign, Package, Users, ArrowUp, FileText 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import '../../styles/clerk/clerkReports.css';

const ClerkReports = () => {
  const { sales, loading: salesLoading } = useContext(SalesContext);
  const { vehicles } = useContext(VehicleContext);
  const { customers } = useContext(CustomerContext);

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalSales: 0,
    averageSale: 0,
    growth: 0,
    topVehicles: [],
    topCustomers: [],
    recentTransactions: [],
    salesTrendData: [],
    paymentMethodsData: [],
    COLORS: ['#4ade80', '#60a5fa', '#facc15']
  });

  useEffect(() => {
    generateReport();
  }, [sales, dateRange, customers]);

  const generateReport = () => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= start && saleDate <= end;
    });

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const totalSales = filteredSales.length;
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
    const growth = totalSales > 0 ? ((totalSales - 1) / totalSales * 100).toFixed(1) : 0;

    // Top Vehicles
    const vehicleSales = {};
    filteredSales.forEach(sale => {
      const id = sale.vehicleId;
      if (!vehicleSales[id]) vehicleSales[id] = { count: 0, revenue: 0 };
      vehicleSales[id].count += 1;
      vehicleSales[id].revenue += sale.totalAmount || 0;
    });
    const topVehicles = Object.entries(vehicleSales)
      .map(([id, data]) => ({ vehicle: vehicles.find(v => v.id === parseInt(id)), ...data }))
      .filter(item => item.vehicle)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top Customers (updated to include totalSpent & purchases)
    const customerSales = {};
    filteredSales.forEach(sale => {
      const id = sale.customerId;
      if (!customerSales[id]) customerSales[id] = { purchases: 0, totalSpent: 0 };
      customerSales[id].purchases += 1;
      customerSales[id].totalSpent += sale.totalAmount || 0;
    });

    const topCustomers = customers
      .map(c => ({
        customer: c,
        purchases: customerSales[c.id]?.purchases || 0,
        revenue: customerSales[c.id]?.totalSpent || 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent Transactions
    const recentTransactions = filteredSales.slice(-10).reverse();

    // Sales Trend Data
    const salesTrendMap = {};
    filteredSales.forEach(sale => {
      const dateKey = new Date(sale.date).toLocaleDateString();
      salesTrendMap[dateKey] = (salesTrendMap[dateKey] || 0) + sale.totalAmount;
    });
    const salesTrendData = Object.entries(salesTrendMap).map(([date, amount]) => ({ date, amount }));

    // Payment Methods
    const paymentMethodsData = [
      { name: 'Cash', value: filteredSales.filter(s => s.paymentMethod === 'cash').length },
      { name: 'Credit Card', value: filteredSales.filter(s => s.paymentMethod === 'credit_card').length },
      { name: 'Financing', value: filteredSales.filter(s => s.paymentMethod === 'financing').length }
    ];

    setReportData({
      totalRevenue,
      totalSales,
      averageSale,
      growth,
      topVehicles,
      topCustomers,
      recentTransactions,
      salesTrendData,
      paymentMethodsData,
      COLORS: ['#4ade80', '#60a5fa', '#facc15']
    });
  };

  const exportToPDF = () => alert('PDF export functionality would be implemented here');
  const exportToCSV = () => alert('CSV export functionality would be implemented here');

  if (salesLoading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

  return (
    <div className="reports-page">
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div className="reports-header-content">
            <h1><BarChart3 size={32} /> Sales Reports</h1>
            <p>Analytics and performance insights</p>
          </div>
          <div className="date-range-selector">
            <label>From</label>
            <input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} />
            <label>To</label>
            <input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} />
          </div>
          <div className="export-buttons">
            <button className="btn-export" onClick={exportToPDF}><FileText size={18}/> PDF</button>
            <button className="btn-export" onClick={exportToCSV}><Download size={18}/> CSV</button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          {[
            { title: 'Total Sales', value: reportData.totalSales, icon: <TrendingUp size={24} />, color: 'blue' },
            { title: 'Total Revenue', value: `$${reportData.totalRevenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'green' },
            { title: 'Average Sale', value: `$${reportData.averageSale.toFixed(0)}`, icon: <Package size={24} />, color: 'purple' },
            { title: 'Active Customers', value: customers.length, icon: <Users size={24} />, color: 'orange' }
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-header">
                <div className="stat-card-info">
                  <h3>{stat.title}</h3>
                  <p className="stat-card-value">{stat.value}</p>
                  <div className="stat-card-change positive"><ArrowUp size={16}/> {reportData.growth}%</div>
                </div>
                <div className={`stat-card-icon ${stat.color}`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-card-header"><h2>Sales Trend</h2><span className="chart-period">Last 30 days</span></div>
            <div className="chart-container">
              {reportData.salesTrendData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.salesTrendData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#4ade80" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <p className="empty-state-text">No sales data in selected range</p>}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header"><h2>Payment Methods</h2><span className="chart-period">Distribution</span></div>
            <div className="chart-container">
              {reportData.paymentMethodsData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.paymentMethodsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {reportData.paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={reportData.COLORS[index % reportData.COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="empty-state-text">No payment data available</p>}
            </div>
          </div>
        </div>

        {/* Top Vehicles & Customers */}
        <div className="top-items-section">
          {[
            { title: 'Top Selling Vehicles', data: reportData.topVehicles, icon: <Package size={48} /> },
            { title: 'Top Customers', data: reportData.topCustomers, icon: <Users size={48} /> }
          ].map((section, idx) => (
            <div key={idx} className="top-items-card">
              <div className="top-items-card-header">
                <h2>{section.title}</h2>
                <a href="#" className="view-all-link">View All</a>
              </div>
              <div className="top-items-list">
                {section.data.length ? section.data.map((item, index) => (
                  <div key={index} className="top-item">
                    <div className={`item-rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                      {index + 1}
                    </div>
                    <div className="item-info">
                      <p className="item-name">{item.vehicle?.make ? `${item.vehicle.make} ${item.vehicle.model}` : item.customer?.name}</p>
                      <p className="item-details">{item.purchases} {section.title.includes('Vehicles') ? 'sales' : 'purchases'}</p>
                    </div>
                    <div className="item-value">${item.revenue.toLocaleString()}</div>
                  </div>
                )) : (
                  <div className="empty-state">{section.icon}<p>No data available</p></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <div className="transactions-header">
            <h2>Recent Transactions</h2>
            <a href="#" className="view-all-link">View All</a>
          </div>
          {reportData.recentTransactions.length ? (
            <table className="transactions-table">
              <thead>
                <tr><th>Invoice</th><th>Customer</th><th>Vehicle</th><th>Date</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {reportData.recentTransactions.map(sale => {
                  const vehicle = vehicles.find(v => v.id === sale.vehicleId);
                  const customer = customers.find(c => c.id === sale.customerId);
                  return (
                    <tr key={sale.id}>
                      <td>{sale.invoiceNumber}</td>
                      <td>{customer?.name || 'Unknown'}</td>
                      <td>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</td>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>${sale.totalAmount?.toLocaleString()}</td>
                      <td><span className="transaction-status completed">{sale.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><BarChart3 size={48} /><h3>No transactions found</h3><p>Transactions will appear here once sales are made</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClerkReports;
