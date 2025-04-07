import { useEffect, useState } from "react";
import dayjs from "dayjs"; // install dayjs via npm if not yet: npm install dayjs

const StatisticsTab = () => {
  const [answers, setAnswers] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [reputation, setReputation] = useState({
    thisWeek: 0,
    thisMonth: 0,
    thisQuarter: 0,
    thisYear: 0,
    allTime: 0,
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAnswers = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(`${BASE_URL}/ques/answers/user/${userId}`);
        const data = await response.json();
        const answers = data.answers || [];
        setAnswers(answers);

        // 🧮 Category Count
        const categoryMap = {};
        answers.forEach((ans) => {
          if (ans.questionTags.length === 0) {
            categoryMap["Other"] = (categoryMap["Other"] || 0) + 1;
          } else {
            ans.questionTags.forEach((tag) => {
              categoryMap[tag] = (categoryMap[tag] || 0) + 1;
            });
          }
        });
        setCategoryCounts(categoryMap);

        // 🧮 Reputation Calculation
        const now = dayjs();
        let week = 0,
          month = 0,
          quarter = 0,
          year = 0;

        answers.forEach((ans) => {
          const created = dayjs(ans.answerCreatedAt);
          if (now.diff(created, "week") === 0) week++;
          if (now.diff(created, "month") === 0) month++;
          if (
            Math.floor((created.month() + 1) / 3) === Math.floor((now.month() + 1) / 3) &&
            now.year() === created.year()
          )
            quarter++;
          if (now.year() === created.year()) year++;
        });

        setReputation({
          thisWeek: week * 10,
          thisMonth: month * 10,
          thisQuarter: quarter * 10,
          thisYear: year * 10,
          allTime: answers.length * 10,
        });
      } catch (error) {
        console.error("Failed to fetch user answers:", error);
      }
    };

    fetchAnswers();
  }, []);

  return (
    <div className="bg-gray-950 text-white rounded-xl border border-gray-700 p-6 space-y-6">
      {/* Chart Placeholder */}
      <div className="border border-gray-700 rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-1">Activity Overview</h2>
        <p className="text-sm text-gray-400 mb-4">Your activity statistics over time</p>
        <div className="bg-gray-800 h-48 rounded-lg flex items-center justify-center text-gray-400">
          Activity chart would be displayed here
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Section */}
        <div className="border border-gray-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Questions by Category</h2>
          <ul className="space-y-2">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <li key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reputation Section */}
        <div className="border border-gray-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Reputation History</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>This Week</span>
              <span className="text-green-400 font-semibold">+{reputation.thisWeek}</span>
            </li>
            <li className="flex justify-between">
              <span>This Month</span>
              <span className="text-green-400 font-semibold">+{reputation.thisMonth}</span>
            </li>
            <li className="flex justify-between">
              <span>This Quarter</span>
              <span className="text-green-400 font-semibold">+{reputation.thisQuarter}</span>
            </li>
            <li className="flex justify-between">
              <span>This Year</span>
              <span className="text-green-400 font-semibold">+{reputation.thisYear}</span>
            </li>
            <li className="flex justify-between">
              <span>All Time</span>
              <span className="font-semibold">{reputation.allTime}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTab;
