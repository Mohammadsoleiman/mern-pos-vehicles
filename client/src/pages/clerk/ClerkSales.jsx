// src/pages/clerk/ClerkSales.jsx
import React, { useContext, useState, useRef } from 'react';
import { VehicleContext } from '../../context/clerk/VehicleContext';
import { SalesContext } from '../../context/clerk/SalesContext';
import { CustomerContext } from '../../context/clerk/CustomerContext';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Search,
  AlertCircle
} from 'lucide-react';
import '../../styles/clerk/clerkSales.css';

const ClerkSales = () => {
  const { vehicles, updateVehicleStock } = useContext(VehicleContext);
  const { addSale } = useContext(SalesContext);
  const { customers, addCustomer } = useContext(CustomerContext);

  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const invoiceRef = useRef(null);

  const availableVehicles = vehicles.filter(v =>
    v.stock > 0 &&
    (v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     v.model?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  // ================== Cart Functions ==================
  const addToCart = (vehicle) => {
    const existing = cart.find(item => item.vehicle.id === vehicle.id);
    if (existing) {
      if (existing.quantity < vehicle.stock) {
        setCart(cart.map(item =>
          item.vehicle.id === vehicle.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else alert('Cannot add more than available stock!');
    } else setCart([...cart, { vehicle, quantity: 1 }]);
  };

  const updateQuantity = (vehicleId, newQty) => {
    const item = cart.find(i => i.vehicle.id === vehicleId);
    if (!item) return;
    if (newQty <= 0) return removeFromCart(vehicleId);
    if (newQty > item.vehicle.stock) return alert('Cannot exceed available stock!');
    setCart(cart.map(item =>
      item.vehicle.id === vehicleId ? { ...item, quantity: newQty } : item
    ));
  };

  const removeFromCart = (vehicleId) => setCart(cart.filter(i => i.vehicle.id !== vehicleId));

  const subtotal = cart.reduce((sum, i) => sum + i.vehicle.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // ================== Sale Processing ==================
  const processSale = async () => {
    if (cart.length === 0) return alert('Cart is empty!');
    if (!selectedCustomer) return alert('Please select a customer!');

    try {
      for (const item of cart) {
        const saleData = {
          vehicleId: item.vehicle.id,
          customerId: selectedCustomer.id,
          quantity: item.quantity,
          unitPrice: item.vehicle.price,
          totalAmount: item.vehicle.price * item.quantity,
          paymentMethod,
          tax: item.vehicle.price * item.quantity * 0.1,
          subtotal: item.vehicle.price * item.quantity
        };

        const invoice = await addSale(saleData);
        await updateVehicleStock(item.vehicle.id, item.quantity);

        setLastInvoice({
          ...invoice,
          customer: selectedCustomer,
          items: cart,
          subtotal,
          tax,
          total
        });
      }
      setShowInvoice(true);
      setCart([]);
      setSelectedCustomer(null);
      setPaymentMethod('cash');
    } catch (err) {
      console.error(err);
      alert('Failed to process sale!');
    }
  };

  // ================== Print Invoice ==================
  const printInvoice = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=600,height=800');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // ================== Add Customer ==================
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const saveNewCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone)
      return alert('Fill all fields!');
    try {
      const added = await addCustomer(newCustomer);
      setSelectedCustomer(added);
      setShowAddCustomer(false);
      setNewCustomer({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add customer!');
    }
  };

  // ================== Components ==================
  const VehicleCard = ({ vehicle }) => (
    <div className="vehicle-card">
      <div className="vehicle-header">
        <div>
          <h4>{vehicle.make} {vehicle.model}</h4>
          <span className="vehicle-year">{vehicle.year}</span>
        </div>
        <span className={`vehicle-stock ${vehicle.stock < 5 ? 'low' : 'ok'}`}>
          {vehicle.stock} left
        </span>
      </div>
      <div className="vehicle-footer">
        <span className="vehicle-price">${vehicle.price?.toLocaleString()}</span>
        <button className="btn-add-to-cart" onClick={() => addToCart(vehicle)}>
          <Plus size={16}/> Add
        </button>
      </div>
    </div>
  );

  const CartItem = ({ item }) => (
    <div className="cart-item">
      <div>
        <p>{item.vehicle.make} {item.vehicle.model}</p>
        <p className="text-light">${item.vehicle.price?.toLocaleString()} each</p>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => updateQuantity(item.vehicle.id, item.quantity - 1)}><Minus size={16}/></button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.vehicle.id, item.quantity + 1)}><Plus size={16}/></button>
      </div>
      <span>${(item.vehicle.price * item.quantity).toLocaleString()}</span>
      <button className="btn-remove" onClick={() => removeFromCart(item.vehicle.id)}><X size={16}/></button>
    </div>
  );

  return (
    <div className="sales-page">
      <div className="sales-container">
        <div className="sales-header">
          <h1><ShoppingCart size={28}/> POS System</h1>
          <p>Quickly process vehicle sales</p>
        </div>

        <div className="sales-main-layout">
          {/* VEHICLES */}
          <div className="products-section">
            <div className="search-box">
              <Search size={18} className="search-icon"/>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="vehicles-grid">
              {availableVehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
            {availableVehicles.length === 0 && (
              <div className="no-data">
                <AlertCircle size={48}/>
                <p>No vehicles available</p>
              </div>
            )}
          </div>

          {/* CART */}
          <div className="cart-section">
            <div className="customer-selection">
              <h3>Select Customer</h3>
              <div className="customer-actions">
                <div className="customer-search">
                  <Search size={16}/>
                  <input
                    type="text"
                    placeholder="Search customer..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  />
                </div>
                <button className="btn-add-customer" onClick={() => setShowAddCustomer(true)}>
                  <Plus size={14}/> Add Customer
                </button>
              </div>

              {selectedCustomer ? (
                <div className="customer-btn selected">
                  <div>
                    <p>{selectedCustomer.name}</p>
                    <p className="text-light">{selectedCustomer.email}</p>
                    <p className="text-light">{selectedCustomer.phone}</p>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)}><X size={16}/></button>
                </div>
              ) : (
                <div className="customer-list">
                  {filteredCustomers.slice(0,5).map(c => (
                    <button
                      key={c.id}
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
              <div className="modal-overlay" onClick={() => setShowAddCustomer(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Add Customer</h2>
                    <button onClick={() => setShowAddCustomer(false)}><X size={24}/></button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newCustomer.name}
                        onChange={handleNewCustomerChange}
                        placeholder="Customer Name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={newCustomer.email}
                        onChange={handleNewCustomerChange}
                        placeholder="Customer Email"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={newCustomer.phone}
                        onChange={handleNewCustomerChange}
                        placeholder="Customer Phone"
                      />
                    </div>
                    <div className="form-actions">
                      <button className="btn-cancel" onClick={() => setShowAddCustomer(false)}>Cancel</button>
                      <button className="btn-submit" onClick={saveNewCustomer}>Save Customer</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="cart-items">
              <h3>Cart ({cart.length})</h3>
              <div className="cart-list">
                {cart.map(item => <CartItem key={item.vehicle.id} item={item} />)}
                {cart.length === 0 && <p className="text-light">Cart is empty</p>}
              </div>

              {/* Payment Options */}
              {cart.length > 0 && (
                <div className="payment-method">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    {['cash','credit_card','financing'].map(method => (
                      <div
                        key={method}
                        className={`payment-option ${paymentMethod===method?'active':''}`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method.replace('_',' ').toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Totals & Checkout */}
              {cart.length > 0 && (
                <div className="totals">
                  <div><span>Subtotal:</span><span>${subtotal.toLocaleString()}</span></div>
                  <div><span>Tax (10%):</span><span>${tax.toLocaleString()}</span></div>
                  <div className="total"><span>Total:</span><span>${total.toLocaleString()}</span></div>
                  <button
                    onClick={processSale}
                    disabled={!selectedCustomer}
                    className="btn-checkout"
                  >
                    Complete Sale
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && lastInvoice && (
        <div className="invoice-modal">
          <div className="invoice-content">
            <div className="invoice-header">
              <h2>Invoice</h2>
              <button onClick={() => setShowInvoice(false)}><X size={24}/></button>
            </div>

            <div ref={invoiceRef} className="invoice-body">
              <div className="invoice-info">
                <h3>Invoice #{lastInvoice.invoiceNumber}</h3>
                <p><strong>Customer:</strong> {lastInvoice.customer.name}</p>
                <p><strong>Email:</strong> {lastInvoice.customer.email}</p>
                <p><strong>Phone:</strong> {lastInvoice.customer.phone}</p>
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
                      <td>{item.vehicle.make} {item.vehicle.model}</td>
                      <td>{item.quantity}</td>
                      <td>${item.vehicle.price.toLocaleString()}</td>
                      <td>${(item.vehicle.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-totals">
                <div><span>Subtotal:</span><span>${lastInvoice.subtotal.toLocaleString()}</span></div>
                <div><span>Tax (10%):</span><span>${lastInvoice.tax.toLocaleString()}</span></div>
                <div className="total"><span>Total:</span><span>${lastInvoice.total.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="invoice-actions">
              <button onClick={printInvoice} className="btn-print">Print</button>
              <button onClick={() => setShowInvoice(false)} className="btn-close">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClerkSales;
