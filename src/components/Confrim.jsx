import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Confirm() {
  const [purchases, setPurchases] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:8889/auth/getpurchase', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data !== undefined) {
          setPurchases(response.data);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }

      // Fetch user role here after fetching purchases
      const role = localStorage.getItem('userRole');
      if (role) {
        console.log('Logged in user:', localStorage.getItem('user'));
        console.log('User role:', role);
        setUserRole(role);
      }
    };

    fetchPurchases();
  }, []);

  const handleEditPurchase = (purchaseId) => {
    console.log(`Editing purchase with ID ${purchaseId}`);
    // Implement editing functionality if needed
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`http://localhost:8889/auth/purchase/${purchaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPurchases(prevPurchases => prevPurchases.filter(purchase => purchase.id !== purchaseId));
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const handleFinishDelivery = async (purchaseId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) return;

      await axios.put(
        `http://localhost:8889/auth/Finish2`, 
        { id: purchaseId }, // Send purchaseId in request body
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update status for the specific purchase
      setPurchases(prevPurchases =>
        prevPurchases.map(purchase =>
          purchase.id === purchaseId ? { ...purchase, status: '1' } : purchase
        )
      );
    } catch (error) {
      console.error('Error finishing delivery:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-500 min-h-screen p-8" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-white shadow-md rounded-lg p-4">
             <img className="w-23 h-50 max-w-50 rounded-lg" src={purchase.img} alt="" />
            <p className="font-bold text-2xl text-black mb-3">{purchase.name}</p>
            <p className="font-bold text-gray-700 mb-2">{purchase.description}</p>
            <p className="font-bold text-gray-700 mb-2">Price: {purchase.price}</p>
            <p className="font-bold text-gray-700 mb-2">Table: {purchase.table}</p>
            <p className="font-bold text-gray-700 mb-2">Quantity: {purchase.quantity}</p>
            <p className="font-bold text-gray-700 mb-2">Payment: {purchase.payment}</p>
                      
            {/* ข้อความจัดส่งเสร็จแล้ว */}
            {purchase.status === '1' && <p className="text-yellow-500 font-bold mt-2">กำลังดำเนินการ</p>}
            {purchase.status === '2' && <p className="text-green-500 font-bold mt-2">เสร็จสิ้น</p>}
            {purchase.status === '3' && <p className="text-blue-500 font-bold mt-2">ชำระเรียบร้อย</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
