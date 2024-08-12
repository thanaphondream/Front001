import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Confirm() {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState({});
  const [userRole, setUserRole] = useState('ADMIN');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch purchases
        const purchaseResponse = await axios.get('http://localhost:8889/auth/getpurchase', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (purchaseResponse.data !== undefined) {
          setPurchases(purchaseResponse.data);
        }

        // Fetch user data
        const userResponse = await axios.get('http://localhost:8889/auth/getUser', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userResponse.data !== undefined) {
          // Create a map of userId to username
          const userMap = userResponse.data.reduce((acc, user) => {
            acc[user.id] = user.username;
            return acc;
          }, {});
          setUsers(userMap);
        }

        // Fetch user role
        const role = localStorage.getItem('userRole');
        if (role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPurchases();
  }, []);

  const handleUpdateStatus = async (purchaseId, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.put(
        'http://localhost:8889/auth/Finish2', 
        { id: purchaseId, status }, // Send purchaseId and status in request body
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Finish response:', response.data);

      // Update status for the specific purchase
      setPurchases(prevPurchases =>
        prevPurchases.map(purchase =>
          purchase.id === purchaseId ? { ...purchase, status: status } : purchase
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Function to group purchases by userId
  const groupPurchasesByUser = (purchases) => {
    return purchases.reduce((groups, purchase) => {
      const { userId } = purchase;
      if (!groups[userId]) {
        groups[userId] = [];
      }
      groups[userId].push(purchase);
      return groups;
    }, {});
  };

  // Group purchases by userId
  const groupedPurchases = groupPurchasesByUser(purchases);

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-500 min-h-screen p-8" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%8D%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      {Object.entries(groupedPurchases).map(([userId, userPurchases]) => (
        <div key={userId} className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">User ID: {userId}</h2>
          <h2 className="text-3xl font-bold text-black mb-4">User Name: {users[userId]}</h2> {/* Display username */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {userPurchases.map((purchase) => (
              <div key={purchase.id} className="bg-white shadow-md rounded-lg p-4">
                <img className="w-23 h-50 max-w-50 rounded-lg" src={purchase.img} alt="" />
                <p className="font-bold text-2xl text-black mb-3">{purchase.name}</p>
                <p className="font-bold text-gray-700 mb-2">{purchase.description}</p>
                <p className="font-bold text-gray-700 mb-2">Price: {purchase.price}</p>
                <p className="font-bold text-gray-700 mb-2">Table: {purchase.table}</p>
                <p className="font-bold text-gray-700 mb-2">Quantity: {purchase.quantity}</p>
                <p className="font-bold text-gray-700 mb-2">Payment: {purchase.payment}</p>
                {/* Dropdown สำหรับเลือกสถานะ */}
                {userRole === 'ADMIN' && (
                  <select
                    value={purchase.status}
                    onChange={(e) => handleUpdateStatus(purchase.id, e.target.value)}
                    className="bg-gray-200 border border-gray-400 rounded p-2 mt-2"
                  >
                    <option value="0">เลือกสถานะ</option>
                    <option value="1">กำลังดำเนินการ</option>
                    <option value="2">เสร็จสิ้น</option>
                    <option value="3">ชำระเรียบร้อย</option>
                  </select>
                )}
                {/* ข้อความแสดงสถานะ */}
                {purchase.status === '1' && <p className="text-yellow-500 font-bold mt-2">กำลังดำเนินการ</p>}
                {purchase.status === '2' && <p className="text-green-500 font-bold mt-2">เสร็จสิ้น</p>}
                {purchase.status === '3' && <p className="text-blue-500 font-bold mt-2">ชำระเรียบร้อย</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
