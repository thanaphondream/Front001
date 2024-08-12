import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showAlert, setShowAlert] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentSlide, setShowPaymentSlide] = useState(false);
  const [showTransferSlide, setShowTransferSlide] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [ imgcredit, setImgcredit ] = useState(null)
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/product', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = selectedProducts.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [selectedProducts]);

  const handleProductSelect = (productId) => {
    const selectedProduct = products.find(product => product.id === productId);
    setSelectedProducts(prevState => [...prevState, { ...selectedProduct, quantity: 1 }]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prevState => prevState.filter(product => product.id !== productId));
  };

  const handleBuyClick = async () => {
    try {
      if (!tableNumber) {
        alert('Please enter table number');
        return;
      }

      if (selectedProducts.length === 0) {
        alert('Please select at least one product');
        return;
      }

      const totalAmount = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
      const confirmationMessage = `You are about to purchase ${selectedProducts.length} product(s) for $${totalAmount}. Payment method: ${paymentMethod}. Table number: ${tableNumber}.`;

      const confirmPurchase = window.confirm(confirmationMessage);
      if (!confirmPurchase) {
        return;
      }

      if (paymentMethod === 'card') {
        setShowPaymentSlide(true);
      } else if (paymentMethod === 'Transfer money') {
        setShowTransferSlide(true);
      } else {
        await handlePurchase();
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
      alert('An error occurred while purchasing the product. Please try again later.');
    }
  };
  const handleFileChange01 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };
  
  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await Promise.all(selectedProducts.map(async (product) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('productId', product.id);
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('paymentMethod', paymentMethod);
        formData.append('table', tableNumber);
        formData.append('img', product.img);
        formData.append('status', product.status || "default_status_value");
  
        if (file) {
          formData.append('image', file);
        }
        // formData.forEach((value, key) => {
        //   console.log(`${key}:`, value);
        // });
  
        try {
          await axios.post('http://localhost:8889/auth/purchase', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Product purchase submitted successfully");
        } catch (error) {
          console.error("Error submitting product purchase:", error.response ? error.response.data : error.message);
        }
      }));
  
      console.log('Products have been purchased');
      setShowAlert(true);
    } catch (err) {
      console.error('error', err);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleTransferSubmit = async () => {
    await handlePurchase();
    console.log('Transfer submitted', receipt);
    setShowTransferSlide(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-500 min-h-screen p-8 relative" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      <h1 className="text-3xl font-semibold mb-8 text-center text-white">Product List</h1>
      <div className="flex">
        <div className={`${selectedProducts.length > 0 ? 'w-2/3' : 'w-full'} transition-all duration-300 ease-in-out`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                <img className="w-48 h-48 rounded-lg mx-auto mb-4" src={product.img} alt={product.name} />
                <div>
                  <h2 className="font-bold text-gray-900 text-xl mb-2 text-center">{product.name}</h2>
                  <p className="font-bold text-gray-700 mb-3 text-center">{product.description}</p>
                  <p className="font-bold text-gray-800 mb-2 text-center">Price: ${product.price}</p>
                </div>
                <button 
                  onClick={() => handleProductSelect(product.id)} 
                  className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300 self-center"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="w-1/3 pl-4 transition-all duration-300 ease-in-out">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4 text-center">Selected Products</h2>
              <ul className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {selectedProducts.map(product => (
                  <li key={product.id} className="border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-800">Price: ${product.price}</p>
                        <div className="flex items-center mt-2">
                          <label htmlFor={`quantity_${product.id}`} className="block text-gray-700 font-bold mr-2">Quantity:</label>
                          <input 
                            type="number" 
                            id={`quantity_${product.id}`}
                            value={product.quantity} 
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value);
                              setSelectedProducts(prevState => prevState.map(p => {
                                if (p.id === product.id) {
                                  return { ...p, quantity: newQuantity };
                                }
                                return p;
                              }));
                            }} 
                            min="1" 
                            step="1"
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveProduct(product.id)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <input 
                  type="text" 
                  value={tableNumber} 
                  onChange={(e) => setTableNumber(e.target.value)} 
                  placeholder="Enter table number" 
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select 
                  value={paymentMethod} 
                  onChange={handlePaymentMethodChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="cash">เงินสด</option>
                  <option value="card">บัตรเครดิต</option>
                  <option value="Transfer money">โอนจ่าย</option>
                </select>
                <button 
                  onClick={handleBuyClick} 
                  className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300"
                >
                  Buy
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Total Price: ${totalPrice.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Slide สำหรับบัตรเครดิต */}
      <div className={`fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-lg transition-transform duration-300 ease-in-out transform ${showPaymentSlide ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Card Payment</h2>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
            <input type="text" id="cardNumber" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input type="text" id="expiryDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="MM/YY" />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
              <input type="text" id="cvv" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="123" />
            </div>
          </div>
          <button className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300">
            Pay ${totalPrice.toFixed(2)}
          </button>
          <button 
            className="w-full mt-2 bg-gray-200 text-gray-800 rounded px-4 py-2 hover:bg-gray-300 transition duration-300"
            onClick={() => setShowPaymentSlide(false)}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Transfer Slide สำหรับโอนจ่าย */}
      <div className={`fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-lg transition-transform duration-300 ease-in-out transform ${showTransferSlide ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Transfer Payment</h2>
          <div className="mb-4">
            <img src="path_to_your_qr_code_image" alt="QR Code" className="w-48 h-48 mx-auto mb-4"/>
          </div>
          <div className="mb-4">
          <label htmlFor="imgcredit" className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            id="imgcredit"
            onChange={handleFileChange01}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          </div>
          <button 
            className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300"
            onClick={handleTransferSubmit}
          >
            Submit
          </button>
          <button 
            className="w-full mt-2 bg-gray-200 text-gray-800 rounded px-4 py-2 hover:bg-gray-300 transition duration-300"
            onClick={() => setShowTransferSlide(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
