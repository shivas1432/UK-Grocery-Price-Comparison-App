import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { Product } from '../../types';
import { getStoreById } from '../../data/stores';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  product: Product;
  storeIds?: string[];
  days?: number;
  height?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  product,
  storeIds,
  days = 30,
  height = 400
}) => {
  const chartData = useMemo(() => {
    const stores = storeIds || product.stores.map(s => s.storeId);
    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Filter price history for the specified period and stores
    const relevantHistory = product.priceHistory.filter(
      entry => 
        entry.date >= startDate && 
        entry.date <= endDate &&
        stores.includes(entry.storeId)
    );

    // Group by date
    const dateGroups = relevantHistory.reduce((groups, entry) => {
      const dateKey = format(entry.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = {};
      }
      groups[dateKey][entry.storeId] = entry.price;
      return groups;
    }, {} as Record<string, Record<string, number>>);

    // Create labels (dates)
    const labels = Object.keys(dateGroups).sort();

    // Create datasets for each store
    const datasets = stores.map(storeId => {
      const store = getStoreById(storeId);
      if (!store) return null;

      const data = labels.map(date => {
        const price = dateGroups[date]?.[storeId];
        return price ? price / 100 : null; // Convert to pounds
      });

      return {
        label: store.name,
        data,
        borderColor: store.color,
        backgroundColor: store.color + '20',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        fill: false,
      };
    }).filter(Boolean);

    return {
      labels: labels.map(date => format(new Date(date), 'MMM dd')),
      datasets
    };
  }, [product, storeIds, days]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `Price History - ${product.name}`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: £${context.parsed.y?.toFixed(2)}`;
          },
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (£)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '£' + (value as number).toFixed(2);
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  if (chartData.datasets.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ height }}
      >
        <p className="text-gray-500">No price history available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
      
      {/* Chart Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {chartData.datasets.map((dataset, index) => {
          const prices = dataset.data.filter(p => p !== null) as number[];
          if (prices.length === 0) return null;
          
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          const currentPrice = prices[prices.length - 1];

          return (
            <div key={index} className="text-center p-2 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{dataset.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                <div>Current: £{currentPrice.toFixed(2)}</div>
                <div>Min: £{minPrice.toFixed(2)}</div>
                <div>Max: £{maxPrice.toFixed(2)}</div>
                <div>Avg: £{avgPrice.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};