import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styled } from 'styled-components';
import { generateLineChartData } from './ChartData';

const StyledBox = styled.div`
    width: 100%;
    height: 400px; /* Set a fixed height or adjust as needed */
    background-color: var(--color-grey-0);
    padding: 3.2rem 3.2rem 1.6rem 1.6rem;
    grid-column: 1 / span 4;
    border-radius: var(--border-radius-md);
    overflow-x: auto;
`;

const LineChartComponent = ({ expenses }) => {
    const data = generateLineChartData(expenses);

    return (
        <StyledBox>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid stroke="var(--color-grey-300)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="expenses" stroke="var(--color-brand-700)" />
                </LineChart>
            </ResponsiveContainer>
        </StyledBox>
    );
};

export default LineChartComponent;
