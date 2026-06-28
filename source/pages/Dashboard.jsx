export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">📊 Total Products: <span className="font-bold">--</span></div>
      <div className="bg-white p-6 rounded-lg shadow">⚠️ Low Stock Alerts: <span className="font-bold text-red-500">--</span></div>
      <div className="bg-white p-6 rounded-lg shadow">🏢 Warehouses: <span className="font-bold">--</span></div>
    </div>
  );
}