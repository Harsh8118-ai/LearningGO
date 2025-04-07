import { useState } from "react";
import ActivityTab from "./ActivityTab";
import BadgesTab from "./BadgesTab";
import StatisticsTab from "./StatisticsTab";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("Activity");

  const tabClasses = (tab) =>
    `w-full text-md py-1 font-medium rounded-xl transition duration-200 ${
      activeTab === tab
        ? "bg-gray-950 text-white"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <div className="max-w-6xl w-full">
      {/* Toggle Bar Container */}
      <div className="flex justify-between bg-gray-800 border border-gray-700 py-0.5 px-0.5 rounded-xl mb-6 shadow-inner">
        {/* Tabs */}
        <button className={tabClasses("Activity")} onClick={() => setActiveTab("Activity")}>
          Activity
        </button>
        <button className={tabClasses("Badges")} onClick={() => setActiveTab("Badges")}>
          Badges
        </button>
        <button className={tabClasses("Statistics")} onClick={() => setActiveTab("Statistics")}>
          Statistics
        </button>
      </div>

      {/* Tab Content */}  
      {activeTab === "Activity" && <ActivityTab />}
      {activeTab === "Badges" && <BadgesTab />}
      {activeTab === "Statistics" && <StatisticsTab />}
    </div>
  );
};

export default ProfileTabs;
