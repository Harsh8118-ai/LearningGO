import React from "react";

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "DevOps",
  "UI/UX Design",
  "Intro"
];

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="relative w-full">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
