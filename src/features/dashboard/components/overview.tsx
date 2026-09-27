import { useRouter } from '@tanstack/react-router';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useRef } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export function Overview() {
  const router = useRouter(); 
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchSentMails();
      hasFetched.current = true;
    }
  }, []);

  const fetchSentMails = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Kindly login or register first", { variant: "warning" });
        router.navigate({ to: "/sign-in" }); // Fixed navigation
        return;
      }

      if (!BACKEND_URL) {
        throw new Error("BACKEND_URL is not defined");
      }

      const response = await axios.get(
        `${BACKEND_URL}/api/v4/sentmailshistory`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        processChartData(response.data);
        enqueueSnackbar("Data Fetched Successfully", { variant: "success" });
      }
      else {
        enqueueSnackbar("Failed to fetch data", { variant: "error" });
      }
    } catch (err) {
      console.error("API Error:", err);
      enqueueSnackbar("Failed to fetch data", { variant: "error" });
    }
  };

  const processChartData = (mails: any) => {
    // Initialize an object to store mail count per month
    console.log(mails)
    const monthData: { [key: string]: number } = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    mails.forEach((mail:any) => {
      const date = new Date(mail.createdAt);
      const monthName = date.toLocaleString('default', { month: 'short' });
      if (monthData.hasOwnProperty(monthName)) {
        monthData[monthName] += 1;
      }
    });

    const formattedData = Object.entries(monthData).map(([name, total]) => ({
      name,
      total
    }));

    console.log("Processed Chart Data:", formattedData);


    setChartData(formattedData);
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData.length>0 ? chartData : [{name:"No Mails Sent", total:0}]}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}