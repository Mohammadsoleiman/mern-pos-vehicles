// src/context/clerk/CustomerContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const CustomerContext = createContext();

export const ClerkCustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize with mock data
    fetchCustomers();
  }, []);

  // Fetch all customers (using mock data)
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Mock customer data
      const mockCustomers = [
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          createdAt: new Date().toISOString(),
          totalPurchases: 2,
          totalSpent: 60000
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          phone: "+1 (555) 234-5678",
          address: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
          createdAt: new Date(Date.now() - 2592000000).toISOString(),
          totalPurchases: 1,
          totalSpent: 27000
        },
        {
          id: 3,
          name: "Michael Brown",
          email: "m.brown@example.com",
          phone: "+1 (555) 345-6789",
          address: "789 Pine Rd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          createdAt: new Date(Date.now() - 5184000000).toISOString(),
          totalPurchases: 1,
          totalSpent: 84000
        },
        {
          id: 4,
          name: "Emily Davis",
          email: "emily.davis@example.com",
          phone: "+1 (555) 456-7890",
          address: "321 Elm St",
          city: "Houston",
          state: "TX",
          zipCode: "77001",
          createdAt: new Date(Date.now() - 7776000000).toISOString(),
          totalPurchases: 1,
          totalSpent: 55000
        },
        {
          id: 5,
          name: "David Wilson",
          email: "d.wilson@example.com",
          phone: "+1 (555) 567-8901",
          address: "555 Maple Dr",
          city: "Phoenix",
          state: "AZ",
          zipCode: "85001",
          createdAt: new Date(Date.now() - 10368000000).toISOString(),
          totalPurchases: 3,
          totalSpent: 95000
        }
      ];
      
      setCustomers(mockCustomers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customers");
      setLoading(false);
    }
  };

  // Add new customer
  const addCustomer = async (customerData) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newCustomer = {
        id: Date.now(),
        ...customerData,
        createdAt: new Date().toISOString(),
        totalPurchases: 0,
        totalSpent: 0
      };
      
      setCustomers([...customers, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error("Error adding customer:", error);
      setError("Failed to add customer");
      throw error;
    }
  };

  // Update customer
  const updateCustomer = async (id, customerData) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCustomer = {
        ...customerData,
        id
      };
      
      setCustomers(customers.map(c => c.id === id ? updatedCustomer : c));
      return updatedCustomer;
    } catch (error) {
      console.error("Error updating customer:", error);
      setError("Failed to update customer");
      throw error;
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
      setError("Failed to delete customer");
      throw error;
    }
  };

  // Get customer by ID
  const getCustomerById = (id) => {
    return customers.find(c => c.id === id);
  };

  // Search customers
  const searchCustomers = (query) => {
    if (!query) return customers;
    
    const lowercaseQuery = query.toLowerCase();
    return customers.filter(c => 
      c.name?.toLowerCase().includes(lowercaseQuery) ||
      c.email?.toLowerCase().includes(lowercaseQuery) ||
      c.phone?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Update customer stats after purchase
  const updateCustomerStats = async (customerId, purchaseAmount) => {
    try {
      const customer = getCustomerById(customerId);
      if (!customer) throw new Error("Customer not found");
      
      const updatedCustomer = {
        ...customer,
        totalPurchases: (customer.totalPurchases || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + purchaseAmount
      };
      
      await updateCustomer(customerId, updatedCustomer);
    } catch (error) {
      console.error("Error updating customer stats:", error);
      throw error;
    }
  };

  // Get top customers by spending
  const getTopCustomers = (limit = 5) => {
    return [...customers]
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, limit);
  };

  // Get recent customers
  const getRecentCustomers = (limit = 5) => {
    return [...customers]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const value = {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    searchCustomers,
    updateCustomerStats,
    getTopCustomers,
    getRecentCustomers,
    setCustomers
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export default ClerkCustomerProvider;