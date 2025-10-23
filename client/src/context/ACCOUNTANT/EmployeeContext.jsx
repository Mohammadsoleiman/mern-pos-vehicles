import React, { createContext, useState } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([
    { id: "EMP001", name: "John Doe", position: "Accountant", salary: 3000 },
    { id: "EMP002", name: "Jane Smith", position: "Cashier", salary: 2500 },
    { id: "EMP003", name: "Mark Lee", position: "Manager", salary: 4000 },
  ]);

  const addEmployee = (employee) => {
    setEmployees([...employees, employee]);
  };

  const editEmployee = (id, updatedEmployee) => {
    setEmployees(
      employees.map((emp) => (emp.id === id ? updatedEmployee : emp))
    );
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, editEmployee, deleteEmployee }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
