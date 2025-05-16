export default function AdminDashboard() {
  return (
    <div>
      <h1>Bảng điều khiển Admin</h1>
      <div className="dashboard-stats">
        {/* Thống kê sẽ được thêm vào đây */}
        <div className="stat-card">
          <h3>Địa điểm cắm trại</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Bài viết blog</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Bài viết</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Người dùng</h3>
          <p className="stat-value">0</p>
        </div>
      </div>
    </div>
  );
} 