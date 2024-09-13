import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar"; 

const AdminDashboard = () => {
  return (
    <div className="flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <div className="overflow-y-auto w-[14vw]">
          <Sidebar />
        </div>
        <div className="flex-1 h-[90vh] overflow-y-auto border-4 border-red-500">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
