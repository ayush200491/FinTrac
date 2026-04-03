import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { calculateExpensesByCategory } from './ChartData';
import { styled } from 'styled-components';
import { ResponsiveContainer } from 'recharts';

const StyledBox = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-color: var(--color-grey-0);
    padding: 0 0 1.6rem 0;
    grid-column: 3 / span 2;
    border-radius: var(--border-radius-md);
`;

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#AF19FF', '#FF1967', '#FF6B19', '#9CFF19',
    '#1971FF', '#FF19E6', '#19FF71', '#19FFBE',
    '#FF1971', '#19FF9E', '#7119FF', '#FF7119'
];

const PieChartComponent = ({ expenses }) => {
    const data = calculateExpensesByCategory(expenses).map((entry, index) => ({
        ...entry,
        color: COLORS[index % COLORS.length],
    }));

    return (
        <StyledBox>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="var(--color-brand-700)"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </StyledBox>
    );
};

export default PieChartComponent;
