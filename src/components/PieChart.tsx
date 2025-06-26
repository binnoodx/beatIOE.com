'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Completed', value: 60 },
  { name: 'New Order', value: 30 },
  { name: 'Pending', value: 10 },
];

const COLORS = ['#00C49F', '#8884d8', '#A569BD']; // green, blue, purple

export default function PieChartComponent() {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow">
      <ResponsiveContainer width="50%" height="50%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
