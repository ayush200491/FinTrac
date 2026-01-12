import React, { useState, useEffect } from 'react';
import Stat from '../ui/Stat';
import { formatCurrency } from '../utils/helpers';
import { FaMoneyBill, FaChartLine, FaCalendarAlt, FaRegCalendar } from 'react-icons/fa';
import { FaRupeeSign } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';
import { useUser } from '../hooks/useUser';

function Stats({ summary }) {
  const { user } = useUser();

  return (
    <>
      <Stat
        title='Current Balance'
        color='blue'
        icon={<MdAccountBalance />}
        value={formatCurrency(user?.balance)}
      />
      <Stat
        title='Total Expenses'
        color='grey'
        icon={<FaRupeeSign />}
        value={formatCurrency(summary.totalTillToday)}
      />
      <Stat
        title='Expenses this month'
        color='indigo'
        icon={<FaCalendarAlt />}
        value={formatCurrency(summary.totalThisMonth)}
      />
      <Stat
        title="Expenses This Year"
        color='green'
        icon={<FaRegCalendar />}
        value={formatCurrency(summary.totalThisYear)}
      />
    </>
  );
}
export default Stats;
