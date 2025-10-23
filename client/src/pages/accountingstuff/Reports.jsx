import React, { useContext, useState } from "react";
import "../../styles/accountant/reports.css";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext";
import { ExpenseContext } from "../../context/ACCOUNTANT/ExpenseContext";
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext";

export default function ReportsSection() {
  const { transactions, totalIncome } = useContext(TransactionContext);
  const { expenses, totalExpenses } = useContext(ExpenseContext);
  const { vehicles } = useContext(VehicleContext);
  const [selectedReport, setSelectedReport] = useState(null);

  // Export to PDF
  const exportToPDF = (reportType) => {
    const doc = new (window.jsPDF || Object)();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(18);
    doc.text(`${reportType} Report`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    if (reportType === "Sales Summary") {
      doc.text(`Total Vehicles Sold: ${transactions.length}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Total Income: $${totalIncome.toLocaleString()}`, 20, yPosition);
    } else if (reportType === "Expense Analysis") {
      doc.text(`Total Expenses: $${totalExpenses.toLocaleString()}`, 20, yPosition);
    } else if (reportType === "Inventory Report") {
      doc.text(`Total Vehicles in Inventory: ${vehicles.length}`, 20, yPosition);
    } else if (reportType === "Profit & Loss") {
      const profit = totalIncome - totalExpenses;
      doc.text(`Net Profit/Loss: $${profit.toLocaleString()}`, 20, yPosition);
    }

    doc.save(`${reportType.replace(" ", "_")}_Report.pdf`);
  };

  // Export to CSV
  const exportToCSV = (reportType) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `${reportType} Report\nGenerated: ${new Date().toLocaleDateString()}\n\n`;

    if (reportType === "Sales Summary") {
      csvContent += "Transaction ID,Amount\n";
      transactions.forEach((t, idx) => {
        csvContent += `${idx + 1},${t.amount || 0}\n`;
      });
    } else if (reportType === "Expense Analysis") {
      csvContent += "Expense ID,Category,Amount\n";
      expenses.forEach((e, idx) => {
        csvContent += `${idx + 1},${e.category || "General"},${e.amount || 0}\n`;
      });
    } else if (reportType === "Inventory Report") {
      csvContent += "Vehicle ID,Make,Model,Price\n";
      vehicles.forEach((v, idx) => {
        csvContent += `${idx + 1},${v.make || "N/A"},${v.model || "N/A"},${v.price || 0}\n`;
      });
    } else if (reportType === "Profit & Loss") {
      csvContent += "Metric,Amount\n";
      csvContent += `Total Income,${totalIncome}\nTotal Expenses,${totalExpenses}\nNet Profit/Loss,${totalIncome - totalExpenses}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType.replace(" ", "_")}_Report.csv`);
    link.click();
  };

  // Reports list
  const reports = [
    { id: 1, name: "Sales Summary", icon: "📊", description: "Total vehicles sold and revenue" },
    { id: 2, name: "Expense Analysis", icon: "💸", description: "Breakdown of all expenses" },
    { id: 3, name: "Inventory Report", icon: "🚗", description: "Current inventory details" },
    { id: 4, name: "Profit & Loss", icon: "📈", description: "P&L statement analysis" },
  ];

  // Report preview content
  const renderReportDetails = (report) => {
    if (!report) return null;

    if (report.name === "Sales Summary") {
      return (
        <>
          <p><b>Total Vehicles Sold:</b> {transactions.length}</p>
          <p><b>Total Income:</b> ${totalIncome.toLocaleString()}</p>
          <p><b>Average Sale Price:</b> ${(totalIncome / (transactions.length || 1)).toLocaleString()}</p>
        </>
      );
    } else if (report.name === "Expense Analysis") {
      return (
        <>
          <p><b>Total Expenses:</b> ${totalExpenses.toLocaleString()}</p>
          <p><b>Expense Items:</b> {expenses.length}</p>
          <p><b>Average Expense:</b> ${(totalExpenses / (expenses.length || 1)).toLocaleString()}</p>
        </>
      );
    } else if (report.name === "Inventory Report") {
      return (
        <>
          <p><b>Total Vehicles:</b> {vehicles.length}</p>
          <p><b>Total Inventory Value:</b> ${vehicles.reduce((sum, v) => sum + (v.price || 0), 0).toLocaleString()}</p>
        </>
      );
    } else if (report.name === "Profit & Loss") {
      const profit = totalIncome - totalExpenses;
      return (
        <>
          <p><b>Total Income:</b> ${totalIncome.toLocaleString()}</p>
          <p><b>Total Expenses:</b> ${totalExpenses.toLocaleString()}</p>
          <p><b>Net Profit/Loss:</b> ${profit.toLocaleString()}</p>
        </>
      );
    }
  };

  return (
    <div className="reports-section">
      <div className="reports-header">
        <h2>📋 Reports & Data Export</h2>
        <p>Generate and export detailed business reports</p>
      </div>

      <div className="reports-grid">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-icon">{report.icon}</div>
            <h3>{report.name}</h3>
            <p>{report.description}</p>
            <div className="report-actions">
              <button className="btn-primary" onClick={() => setSelectedReport(report)}>View</button>
              <button className="btn-secondary" onClick={() => exportToPDF(report.name)}>PDF</button>
              <button className="btn-secondary" onClick={() => exportToCSV(report.name)}>CSV</button>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="report-modal">
          <div className="report-modal-content">
            <h3>{selectedReport.icon} {selectedReport.name}</h3>
            {renderReportDetails(selectedReport)}
            <button className="btn-secondary" onClick={() => setSelectedReport(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
