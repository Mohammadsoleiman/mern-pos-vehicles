import React, { useContext, useState, useRef } from "react";
import { VehicleContext } from "../../context/clerk/VehicleContext";
import { SalesContext } from "../../context/clerk/SalesContext";
import { CustomerContext } from "../../context/clerk/CustomerContext";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Search,
  AlertCircle,
} from "lucide-react";
import "../../styles/clerk/clerkSales.css";

const ClerkSales = () => {
  const { vehicles, updateVehicleStock: ctxUpdateVehicleStock, decrementStock } =
    useContext(VehicleContext);
  const { addSale } = useContext(SalesContext);
  const { customers, addCustomer, refreshCustomerTotals } =
    useContext(CustomerContext);

  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const invoiceRef = useRef(null);

  // ✅ Helper for Mongo or numeric IDs
  const getId = (obj) => String(obj?._id || obj?.id || obj || "");

  // 🛡️ SAFE WRAPPER for stock updates (prevents TypeError)
  const safeUpdateVehicleStock = async (vehicleId, qty) => {
    // 1) Preferred: context function named updateVehicleStock
    if (typeof ctxUpdateVehicleStock === "function") {
      return await ctxUpdateVehicleStock(vehicleId, qty);
    }
    // 2) Alternate name some projects use
    if (typeof decrementStock === "function") {
      return await decrementStock(vehicleId, qty);
    }
    // 3) Fallback: simple PATCH to adjust stock on backend
    try {
      await fetch(`http://localhost:5000/api/vehicles/${vehicleId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta: -Math.abs(qty) }),
      });
    } catch (e) {
      console.warn("Stock fallback request failed:", e);
    }
  };

  // ================== Filters ==================
  const availableVehicles = vehicles.filter(
    (v) =>
      (v.stock || 0) > 0 &&
      (v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  // ================== Cart Functions ==================
  const addToCart = (vehicle) => {
    const existing = cart.find((item) => getId(item.vehicle) === getId(vehicle));
    if (existing) {
      if (existing.quantity < (vehicle.stock || 0)) {
        setCart(
          cart.map((item) =>
            getId(item.vehicle) === getId(vehicle)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else alert("Cannot add more than available stock!");
    } else setCart([...cart, { vehicle, quantity: 1 }]);
  };

  const updateQuantity = (vehicleId, newQty) => {
    const item = cart.find((i) => getId(i.vehicle) === String(vehicleId));
    if (!item) return;
    if (newQty <= 0) return removeFromCart(vehicleId);
    if (newQty > (item.vehicle.stock || 0))
      return alert("Cannot exceed available stock!");
    setCart(
      cart.map((item) =>
        getId(item.vehicle) === String(vehicleId)
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (vehicleId) =>
    setCart(cart.filter((i) => getId(i.vehicle) !== String(vehicleId)));

  const subtotal = cart.reduce(
    (sum, i) => sum + (Number(i.vehicle.price) || 0) * i.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // ================== Sale Processing ==================
  const processSale = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!selectedCustomer) return alert("Please select a customer!");

    try {
      let createdInvoice = null;

      for (const item of cart) {
        const vehicleId = getId(item.vehicle);
        const customerId = getId(selectedCustomer);

        const saleData = {
          vehicleId,
          customerId,
          quantity: item.quantity,
          unitPrice: item.vehicle.price,
          totalAmount: (Number(item.vehicle.price) || 0) * item.quantity,
          paymentMethod,
          tax: (Number(item.vehicle.price) || 0) * item.quantity * 0.1,
          subtotal: (Number(item.vehicle.price) || 0) * item.quantity,
        };

        // 1️⃣ Record the sale
        const invoice = await addSale(saleData);
        createdInvoice = invoice;

        // 2️⃣ Update vehicle stock (safe wrapper avoids TypeError)
        await safeUpdateVehicleStock(vehicleId, item.quantity);

        // 3️⃣ Update customer totals in DB
        await fetch("http://localhost:5000/api/customers/updateTotals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            amount: saleData.totalAmount,
          }),
        });

        // 4️⃣ Instantly refresh customer data in frontend
        if (typeof refreshCustomerTotals === "function") {
          await refreshCustomerTotals(customerId);
        }
      }

      // 5️⃣ Save invoice details
      if (createdInvoice) {
        setLastInvoice({
          ...createdInvoice,
          customer: selectedCustomer,
          items: cart,
          subtotal,
          tax,
          total,
        });
      }

      // 6️⃣ Ask user if they want to view/print invoice
      const wantsInvoice = window.confirm(
        "✅ Sale completed! Do you want to view and print the invoice?"
      );
      if (wantsInvoice) {
        setShowInvoice(true);
      } else {
        setShowInvoice(false);
      }

      // 7️⃣ Reset cart & payment
      setCart([]);
      setSelectedCustomer(null);
      setPaymentMethod("cash");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to process sale!");
    }
  };

  // ================== Print Invoice ==================
  const printInvoice = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "", "width=600,height=800");
    printWindow.document.write(
      "<html><head><title>Invoice</title></head><body>"
    );
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  // ================== Add Customer ==================
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone)
      return alert("Fill all fields!");
    try {
      const added = await addCustomer(newCustomer);
      setSelectedCustomer(added);
      setShowAddCustomer(false);
      setNewCustomer({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add customer!");
    }
  };

  // ================== UI Components ==================
  const VehicleCard = ({ vehicle }) => (
    <div className="vehicle-card">
      <div className="vehicle-header">
        <div>
          <h4>
            {vehicle.make} {vehicle.model}
          </h4>
          <span className="vehicle-year">{vehicle.year}</span>
        </div>
        <span
          className={`vehicle-stock ${
            (vehicle.stock || 0) < 5 ? "low" : "ok"
          }`}
        >
          {vehicle.stock || 0} left
        </span>
      </div>
      <div className="vehicle-footer">
        <span className="vehicle-price">
          ${vehicle.price?.toLocaleString()}
        </span>
        <button className="btn-add-to-cart" onClick={() => addToCart(vehicle)}>
          <Plus size={16} /> Add
        </button>
      </div>
    </div>
  );

  const CartItem = ({ item }) => (
    <div className="cart-item">
      <div>
        <p>
          {item.vehicle.make} {item.vehicle.model}
        </p>
        <p className="text-light">
          ${item.vehicle.price?.toLocaleString()} each
        </p>
      </div>
      <div className="cart-item-quantity">
        <button
          onClick={() =>
            updateQuantity(getId(item.vehicle), item.quantity - 1)
          }
        >
          <Minus size={16} />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() =>
            updateQuantity(getId(item.vehicle), item.quantity + 1)
          }
        >
          <Plus size={16} />
        </button>
      </div>
      <span>
        ${(item.vehicle.price * item.quantity).toLocaleString()}
      </span>
      <button
        className="btn-remove"
        onClick={() => removeFromCart(getId(item.vehicle))}
      >
        <X size={16} />
      </button>
    </div>
  );

  // ================== Render ==================
  return (
    <div className="sales-page">
      <div className="sales-container">
        <div className="sales-header">
          <h1>
            <ShoppingCart size={28} /> POS System
          </h1>
          <p>Quickly process vehicle sales</p>
        </div>

        <div className="sales-main-layout">
          {/* VEHICLES */}
          <div className="products-section">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="vehicles-grid">
              {availableVehicles.map((v) => (
                <VehicleCard key={getId(v)} vehicle={v} />
              ))}
            </div>
            {availableVehicles.length === 0 && (
              <div className="no-data">
                <AlertCircle size={48} />
                <p>No vehicles available</p>
              </div>
            )}
          </div>

          {/* CART & CUSTOMER */}
          <div className="cart-section">
            <div className="customer-selection">
              <h3>Select Customer</h3>
              <div className="customer-actions">
                <div className="customer-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search customer..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  className="btn-add-customer"
                  onClick={() => setShowAddCustomer(true)}
                >
                  <Plus size={14} /> Add Customer
                </button>
              </div>

              {selectedCustomer ? (
                <div className="customer-btn selected">
                  <div>
                    <p>{selectedCustomer.name}</p>
                    <p className="text-light">{selectedCustomer.email}</p>
                    <p className="text-light">{selectedCustomer.phone}</p>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="customer-list">
                  {filteredCustomers.slice(0, 5).map((c) => (
                    <button
                      key={getId(c)}
                      onClick={() => setSelectedCustomer(c)}
                      className="customer-btn"
                    >
                      <p>{c.name}</p>
                      <p className="text-light">{c.email}</p>
                      <p className="text-light">{c.phone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Customer Modal */}
            {showAddCustomer && (
              <div
                className="modal-overlay"
                onClick={() => setShowAddCustomer(false)}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h2>Add Customer</h2>
                    <button onClick={() => setShowAddCustomer(false)}>
                      <X size={24} />
                    </button>
                  </div>
                  <div className="modal-body">
                    {["name", "email", "phone"].map((field) => (
                      <div className="form-group" key={field}>
                        <label>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={newCustomer[field]}
                          onChange={handleNewCustomerChange}
                          placeholder={`Customer ${field}`}
                        />
                      </div>
                    ))}
                    <div className="form-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => setShowAddCustomer(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-submit"
                        onClick={saveNewCustomer}
                      >
                        Save Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items + Payment + Totals */}
            <div className="cart-items">
              <h3>Cart ({cart.length})</h3>
              <div className="cart-list">
                {cart.map((item) => (
                  <CartItem key={getId(item.vehicle)} item={item} />
                ))}
                {cart.length === 0 && (
                  <p className="text-light">Cart is empty</p>
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="payment-method">
                    <h3>Payment Method</h3>
                    <div className="payment-options">
                      {["cash", "credit_card", "financing"].map((method) => (
                        <div
                          key={method}
                          className={`payment-option ${
                            paymentMethod === method ? "active" : ""
                          }`}
                          onClick={() => setPaymentMethod(method)}
                        >
                          {method.replace("_", " ").toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="totals">
                    <div>
                      <span>Subtotal:</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span>Tax (10%):</span>
                      <span>${tax.toLocaleString()}</span>
                    </div>
                    <div className="total">
                      <span>Total:</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={processSale}
                      disabled={!selectedCustomer}
                      className="btn-checkout"
                    >
                      Complete Sale
                    </button>

                    {/* Manual invoice view button */}
                    {lastInvoice && (
                      <button
                        onClick={() => setShowInvoice(true)}
                        className="btn-view-invoice"
                      >
                        View Last Invoice
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* INVOICE MODAL */}
      {showInvoice && lastInvoice && (
        <div className="invoice-modal">
          <div className="invoice-content">
            <div className="invoice-header">
              <h2>Invoice</h2>
              <button onClick={() => setShowInvoice(false)}>
                <X size={24} />
              </button>
            </div>

            <div ref={invoiceRef} className="invoice-body">
              <div className="invoice-info">
                <h3>Invoice #{lastInvoice.invoiceNumber || "N/A"}</h3>
                <p>
                  <strong>Customer:</strong> {lastInvoice.customer.name}
                </p>
                <p>
                  <strong>Email:</strong> {lastInvoice.customer.email}
                </p>
                <p>
                  <strong>Phone:</strong> {lastInvoice.customer.phone}
                </p>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lastInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.vehicle.make} {item.vehicle.model}
                      </td>
                      <td>{item.quantity}</td>
                      <td>${item.vehicle.price.toLocaleString()}</td>
                      <td>
                        ${(item.vehicle.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-totals">
                <div>
                  <span>Subtotal:</span>
                  <span>${lastInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div>
                  <span>Tax (10%):</span>
                  <span>${lastInvoice.tax.toLocaleString()}</span>
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>${lastInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="invoice-actions">
              <button onClick={printInvoice} className="btn-print">
                Print
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="btn-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClerkSales;