import React from "react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Users } from "lucide-react";
import Connections from "./NetworkToggle/Connections";
import Requests from "./NetworkToggle/Requests";
import Sent from "./NetworkToggle/Sent";

const NetworkTab = () => {
  const [activeTab, setActiveTab] = useState("Connections");
  
    const tabClasses = (tab) =>
      `w-full text-md py-1 font-medium rounded-xl transition duration-200 ${
        activeTab === tab
          ? "bg-gray-950 text-white"  
          : "text-gray-300 hover:text-white"
      }`;
      
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 text-white">
      {/* Header */}
      
      <div className="bg-gray-950 rounded-2xl border border-[#2c2c32] p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Your Network</h2>
          <p className="text-sm text-muted-foreground">
            Manage your connections and grow your Network
          </p>
        </div>
        <button className="gap-2 flex justify-center items-center border border-[#2c2c32] rounded-lg px-3 py-1.5 text-sm text-white hover:bg-[#1a1a1f]">
          <Users size={16} />
          Find Connections
        </button>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-3">
        <span className="bg-purple-600/20 text-purple-400 text-sm px-3 border border-gray-950 rounded-full font-medium">
          42 Connections
        </span>
        <span className="bg-blue-600/20 text-blue-400 text-sm px-3 border border-gray-950 rounded-full font-medium">
          18 Mutual Connections
        </span>
        <span className="bg-green-600/20 text-green-400 text-sm px-3 border border-gray-950 rounded-full font-medium">
          5 New This Month
        </span>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl w-full">
      {/* Toggle Bar Container */}
      <div className="flex justify-between bg-gray-800 border border-gray-700 py-0.5 px-0.5 rounded-xl mb-6 shadow-inner">
        {/* Tabs */}
        <button className={tabClasses("Connections")} onClick={() => setActiveTab("Connections")}>
          Connections
        </button>
        <button className={tabClasses("Requests")} onClick={() => setActiveTab("Requests")}>
          Requests
        </button>
        <button className={tabClasses("Sent")} onClick={() => setActiveTab("Sent")}>
          Sent
        </button>
      </div>

      {/* Tab Content */}  
      {activeTab === "Connections" && <Connections /> }
      {activeTab === "Requests" && <Requests />}
      {activeTab === "Sent" && <Sent />}
    </div>
    </div>



      {/* Network Insights */}
      <div className="grid md:grid-cols-2 gap-6 rounded-xl border border-white/10 p-6">
        {/* Left: Chart placeholder */}
        <div className="bg-muted/10 rounded-xl flex items-center justify-center h-48 text-muted-foreground text-center">
          Connection growth chart would be displayed here
        </div>

        {/* Right: Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Network Breakdown</h3>
          <BreakdownItem label="Web Development" percent={42} color="bg-purple-500" />
          <BreakdownItem label="Data Science" percent={28} color="bg-blue-400" />
          <BreakdownItem label="UI/UX Design" percent={18} color="bg-purple-400" />
          <BreakdownItem label="DevOps" percent={12} color="bg-green-400" />
        </div>
      </div>

      {/* Groups & Communities Header */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Groups & Communities</h3>
        <p className="text-sm text-muted-foreground">
          Groups and communities you're a part of
        </p>

        <div className="flex justify-center">
          <Button variant="outline">Discover More Communities</Button>
        </div>
      </div>
    </div>
  );
};

// Breakdown Item Component
const BreakdownItem = ({ label, percent, color }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">{percent}%</span>
      </div>
      <div className="w-full bg-muted/20 h-2 rounded-full">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default NetworkTab;
