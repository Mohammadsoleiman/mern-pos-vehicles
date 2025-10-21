import React, { useContext, useState } from "react";
import "../../styles/accountant/tax.css";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext";
import { ExpenseContext } from "../../context/ACCOUNTANT/ExpenseContext";

export default function TaxCalculationsSection() {
  const { totalIncome } = useContext(TransactionContext);
  const { totalExpenses } = useContext(ExpenseContext);
  const [salesTaxRate, setSalesTaxRate] = useState(7.5);
  const [incomeTaxRate, setIncomeTaxRate] = useState(25);
  const [deductibleExpenses, setDeductibleExpenses] = useState(0);

  // Calculate taxes
  const salesTax = (totalIncome * (salesTaxRate / 100)).toFixed(2);
  const netIncome = (totalIncome - totalExpenses).toFixed(2);
  const taxableIncome = Math.max(0, netIncome - deductibleExpenses).toFixed(2);
  const incomeTax = (taxableIncome * (incomeTaxRate / 100)).toFixed(2);
  const totalTaxLiability = (parseFloat(salesTax) + parseFloat(incomeTax)).toFixed(2);

  // Export Tax Report to CSV
  const exportTaxReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "TAX CALCULATION REPORT\n";
    csvContent += `Generated: ${new Date().toLocaleDateString()}\n`;
    csvContent += `Generated Time: ${new Date().toLocaleTimeString()}\n\n`;
    
    csvContent += "SALES TAX\n";
    csvContent += `Total Income,${parseFloat(totalIncome).toLocaleString()}\n`;
    csvContent += `Sales Tax Rate (%),%${salesTaxRate}\n`;
    csvContent += `Sales Tax Due,${salesTax}\n\n`;
    
    csvContent += "INCOME TAX\n";
    csvContent += `Total Income,${parseFloat(totalIncome).toLocaleString()}\n`;
    csvContent += `Total Expenses,${parseFloat(totalExpenses).toLocaleString()}\n`;
    csvContent += `Net Income,${netIncome}\n`;
    csvContent += `Deductible Expenses,${deductibleExpenses}\n`;
    csvContent += `Taxable Income,${taxableIncome}\n`;
    csvContent += `Income Tax Rate (%),%${incomeTaxRate}\n`;
    csvContent += `Income Tax Due,${incomeTax}\n\n`;
    
    csvContent += "TOTAL TAX LIABILITY\n";
    csvContent += `Sales Tax,${salesTax}\n`;
    csvContent += `Income Tax,${incomeTax}\n`;
    csvContent += `Total Tax Liability,${totalTaxLiability}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tax_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="tax-section">
      <div className="tax-header">
        <h2>🧮 Tax Calculations</h2>
        <p>Manage sales tax, income tax, and deductible expenses</p>
      </div>

      <div className="tax-grid">
        {/* Sales Tax Card */}
        <div className="tax-card">
          <div className="tax-card-header">
            <h3>Sales Tax</h3>
            <span className="tax-icon">💰</span>
          </div>
          
          <div className="tax-input-group">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              value={salesTaxRate}
              onChange={(e) => setSalesTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
              step="0.1"
              min="0"
              max="100"
              className="tax-input"
            />
          </div>

          <div className="tax-breakdown">
            <div className="breakdown-row">
              <span>Total Income</span>
              <strong>${parseFloat(totalIncome).toLocaleString()}</strong>
            </div>
            <div className="breakdown-row">
              <span>Tax Rate</span>
              <strong>{salesTaxRate}%</strong>
            </div>
            <div className="breakdown-row highlight">
              <span>Sales Tax Due</span>
              <strong className="tax-amount">${salesTax}</strong>
            </div>
          </div>
        </div>

        {/* Income Tax Card */}
        <div className="tax-card">
          <div className="tax-card-header">
            <h3>Income Tax</h3>
            <span className="tax-icon">📊</span>
          </div>

          <div className="tax-input-group">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              value={incomeTaxRate}
              onChange={(e) => setIncomeTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
              step="0.1"
              min="0"
              max="100"
              className="tax-input"
            />
          </div>

          <div className="tax-breakdown">
            <div className="breakdown-row">
              <span>Income</span>
              <strong>${parseFloat(totalIncome).toLocaleString()}</strong>
            </div>
            <div className="breakdown-row">
              <span>Expenses</span>
              <strong>-${parseFloat(totalExpenses).toLocaleString()}</strong>
            </div>
            <div className="breakdown-row">
              <span>Net Income</span>
              <strong>${netIncome}</strong>
            </div>
            <div className="breakdown-row highlight">
              <span>Income Tax Due</span>
              <strong className="tax-amount">${incomeTax}</strong>
            </div>
          </div>
        </div>

        {/* Deductible Expenses Card */}
        <div className="tax-card">
          <div className="tax-card-header">
            <h3>Deductible Expenses</h3>
            <span className="tax-icon">✂️</span>
          </div>

          <div className="tax-input-group">
            <label>Deductible Amount ($)</label>
            <input
              type="number"
              value={deductibleExpenses}
              onChange={(e) => setDeductibleExpenses(Math.max(0, parseFloat(e.target.value) || 0))}
              step="50"
              min="0"
              className="tax-input"
            />
          </div>

          <div className="tax-breakdown">
            <div className="breakdown-row">
              <span>Net Income</span>
              <strong>${netIncome}</strong>
            </div>
            <div className="breakdown-row">
              <span>Deductible Expenses</span>
              <strong>-${deductibleExpenses.toLocaleString()}</strong>
            </div>
            <div className="breakdown-row highlight">
              <span>Taxable Income</span>
              <strong className="tax-amount">${taxableIncome}</strong>
            </div>
          </div>
        </div>

        {/* Total Tax Liability Card */}
        <div className="tax-card tax-card-total">
          <div className="tax-card-header">
            <h3>Total Tax Liability</h3>
            <span className="tax-icon">⚖️</span>
          </div>

          <div className="tax-summary">
            <div className="summary-item">
              <span>Sales Tax</span>
              <span className="summary-value">${salesTax}</span>
            </div>
            <div className="summary-item">
              <span>Income Tax</span>
              <span className="summary-value">${incomeTax}</span>
            </div>
            <div className="summary-item total-item">
              <span>Total Tax Due</span>
              <span className="total-value">${totalTaxLiability}</span>
            </div>
          </div>

          <button className="btn-export" onClick={exportTaxReport}>
            📥 Export Tax Report
          </button>
        </div>
      </div>
    </div>
  );
}