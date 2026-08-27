import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Component to display a bar chart of top-selling products.
// It fetches data from GET /admin/analytics/product-popularity.
const ProductPopularityChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/admin/analytics/product-popularity', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const json = await res.json();
        const labels = json.map((item) => item.productName);
        const data = json.map((item) => item.orderCount);

        const ctx = canvasRef.current.getContext('2d');
        // Destroy previous chart if exists
        if (canvasRef.current.chart) {
          canvasRef.current.chart.destroy();
        }
        canvasRef.current.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Orders',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true },
            },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
          },
        });
      } catch (err) {
        console.error('Failed to load product popularity data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="product-popularity-chart">
      <canvas ref={canvasRef} height="200" />
    </div>
  );
};

export default ProductPopularityChart;
