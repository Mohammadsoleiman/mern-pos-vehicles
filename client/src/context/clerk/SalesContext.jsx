// src/context/clerk/SalesContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const SalesContext = createContext();

export const ClerkSalesProvider = ({ children }) => {
const [sales, setSales] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
// Initialize with mock data
fetchSales();
}, []);

// Fetch all sales (using mock data)
const fetchSales = async () => {
try {
setLoading(true);
setError(null);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock sales data
  const mockSales = [
    {
      id: 1,
      vehicleId: 1,
      customerId: 1,
      quantity: 1,
      unitPrice: 25000,
      totalAmount: 25000,
      paymentMethod: "credit_card",
      date: new Date().toISOString(),
      invoiceNumber: "INV-001",
      status: "completed"
    },
    {
      id: 2,
      vehicleId: 2,
      customerId: 2,
      quantity: 1,
      unitPrice: 27000,
      totalAmount: 27000,
      paymentMethod: "financing",
      date: new Date(Date.now() - 86400000).toISOString(),
      invoiceNumber: "INV-002",
      status: "completed"
    },
    {
      id: 3,
      vehicleId: 4,
      customerId: 3,
      quantity: 2,
      unitPrice: 42000,
      totalAmount: 84000,
      paymentMethod: "cash",
      date: new Date(Date.now() - 172800000).toISOString(),
      invoiceNumber: "INV-003",
      status: "completed"
    },
    {
      id: 4,
      vehicleId: 6,
      customerId: 4,
      quantity: 1,
      unitPrice: 55000,
      totalAmount: 55000,
      paymentMethod: "credit_card",
      date: new Date(Date.now() - 259200000).toISOString(),
      invoiceNumber: "INV-004",
      status: "completed"
    },
    {
      id: 5,
      vehicleId: 3,
      customerId: 1,
      quantity: 1,
      unitPrice: 35000,
      totalAmount: 35000,
      paymentMethod: "cash",
      date: new Date(Date.now() - 345600000).toISOString(),
      invoiceNumber: "INV-005",
      status: "completed"
    }
  ];
  
  setSales(mockSales);
  setLoading(false);
} catch (error) {
  console.error("Error fetching sales:", error);
  setError("Failed to load sales");
  setLoading(false);
}
};

// Add new sale
const addSale = async (saleData) => {
try {
setError(null);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate invoice number
  const invoiceNumber = `INV-${String(sales.length + 1).padStart(4, '0')}`;
  
  const newSale = {
    id: Date.now(),
    ...saleData,
    invoiceNumber,
    date: new Date().toISOString(),
    status: "completed"
  };
  
  setSales([newSale, ...sales]);
  return newSale;
} catch (error) {
  console.error("Error adding sale:", error);
  setError("Failed to add sale");
  throw error;
}
};

// Update sale
const updateSale = async (id, saleData) => {
try {
setError(null);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const updatedSale = {
    ...saleData,
    id
  };
  
  setSales(sales.map(s => s.id === id ? updatedSale : s));
  return updatedSale;
} catch (error) {
  console.error("Error updating sale:", error);
  setError("Failed to update sale");
  throw error;
}
};

// Delete sale
const deleteSale = async (id) => {
try {
setError(null);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  setSales(sales.filter(s => s.id !== id));
} catch (error) {
  console.error("Error deleting sale:", error);
  setError("Failed to delete sale");
  throw error;
}
};

// Get sale by ID
const getSaleById = (id) => {
return sales.find(s => s.id === id);
};

// Get sales by customer
const getSalesByCustomer = (customerId) => {
return sales.filter(s => s.customerId === customerId);
};

// Get sales by vehicle
const getSalesByVehicle = (vehicleId) => {
return sales.filter(s => s.vehicleId === vehicleId);
};

// Get sales by date range
const getSalesByDateRange = (startDate, endDate) => {
return sales.filter(s => {
const saleDate = new Date(s.date);
return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
});
};

// Get today's sales
const getTodaySales = () => {
const today = new Date().toISOString().split('T')[0];
return sales.filter(s => s.date?.startsWith(today));
};

// Calculate total revenue
const getTotalRevenue = () => {
return sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
};

// Get sales statistics
const getSalesStats = () => {
const totalSales = sales.length;
const totalRevenue = getTotalRevenue();
const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
const todaySales = getTodaySales().length;

return {
  totalSales,
  totalRevenue,
  averageSale,
  todaySales
};
};

// Generate invoice
const generateInvoice = (saleId) => {
const sale = getSaleById(saleId);
if (!sale) return null;

return {
  invoiceNumber: sale.invoiceNumber,
  date: new Date(sale.date).toLocaleDateString(),
  items: [{
    description: `Vehicle ID: ${sale.vehicleId}`,
    quantity: sale.quantity,
    unitPrice: sale.unitPrice,
    total: sale.totalAmount
  }],
  subtotal: sale.totalAmount,
  tax: sale.totalAmount * 0.1, // 10% tax
  total: sale.totalAmount * 1.1,
  paymentMethod: sale.paymentMethod,
  status: sale.status
};
};

const value = {
sales,
loading,
error,
fetchSales,
addSale,
updateSale,
deleteSale,
getSaleById,
getSalesByCustomer,
getSalesByVehicle,
getSalesByDateRange,
getTodaySales,
getTotalRevenue,
getSalesStats,
generateInvoice,
setSales
};

return (
<SalesContext.Provider value={value}>
{children}
</SalesContext.Provider>
);
};

export default ClerkSalesProvider;

