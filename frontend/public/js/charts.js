document.addEventListener('DOMContentLoaded', function () {
  /********************************************************
   * 1) CONTRACT ADDRESS INPUT
   ********************************************************/
  const addressInput = document.querySelector('.address-input');
  if (addressInput) {
    addressInput.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const contractAddress = e.target.value.trim();
        if (!contractAddress) {
          console.warn('[WARNING] Contract address is empty!');
          return;
        }

        console.log('[INFO] Address entered:', contractAddress);
        resetChartAndFields();

        try {
          await clearAPIData();
          console.log('[INFO] API data cleared.');
        } catch (error) {
          console.error('[ERROR] Clearing API data:', error);
          return;
        }

        try {
          await sendContractAddressToBot(contractAddress);
        } catch (error) {
          console.error('[ERROR] Sending contract address:', error);
        }
      }
    });
  }

  async function sendContractAddressToBot(contractAddress) {
    const apiEndpoint =
      'http://ec2-3-80-88-97.compute-1.amazonaws.com:3001/sendContractAddress';
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractAddress }),
    });
    if (!response.ok) {
      throw new Error(`SendContract error: ${response.status}`);
    }
    console.log('[INFO] Contract address sent successfully.');
  }

  async function clearAPIData() {
    const response = await fetch(
      'http://ec2-3-80-88-97.compute-1.amazonaws.com:3000/clearData',
      {
        method: 'POST',
      }
    );
    if (!response.ok) {
      throw new Error(`clearData error: ${response.status}`);
    }
  }

  /********************************************************
   * 2) CLUSTERS CHART LOGIC
   ********************************************************/
  let clusterChart = null;

  // Utility: Reset chart and text fields
  function resetChartAndFields() {
    if (clusterChart instanceof Chart) {
      clusterChart.destroy();
      clusterChart = null;
    }
    // Reset chart stat
    const chartStat = document.getElementById('activeHoldingStat');
    if (chartStat) chartStat.textContent = 'No Data';

    // Reset data fields
    document.getElementById('activeClusterPercent').textContent = 'Loading...';
    document.getElementById('cluster1Wallets').textContent = 'Loading...';
    document.getElementById('cluster1Percent').textContent = 'Loading...';
    document.getElementById('cluster2Wallets').textContent = 'Loading...';
    document.getElementById('cluster2Percent').textContent = 'Loading...';
    document.getElementById('cluster3Wallets').textContent = 'Loading...';
    document.getElementById('cluster3Percent').textContent = 'Loading...';
    console.log('[INFO] Chart and data fields reset.');
  }

  function updateClusterChart(data) {
    const ctx = document.getElementById('clusterChart');
    const chartStatElement = document.getElementById('activeHoldingStat');

    if (!ctx) {
      console.error('[Clusters] Canvas not found.');
      return;
    }

    // 1) Find the item in data that has 'walletList'
    const tokenData = data.find((item) => item.walletList);
    if (!tokenData || !Array.isArray(tokenData.walletList)) {
      console.error('[Clusters] Invalid or missing walletList.');
      if (chartStatElement) chartStatElement.textContent = 'No Data';
      return;
    }

    // 2) Group wallets by color
    const groupedData = tokenData.walletList.reduce((acc, wallet) => {
      if (!acc[wallet.color]) {
        acc[wallet.color] = { color: wallet.color, totalPercentage: 0, wallets: [] };
      }
      acc[wallet.color].wallets.push(wallet);
      acc[wallet.color].totalPercentage += parseFloat(wallet.percentage) || 0;
      return acc;
    }, {});

    // 3) Convert to array and sort
    const chartData = Object.values(groupedData)
      .map((group) => ({
        value: group.totalPercentage,
        color: group.color,
        wallets: group.wallets,
      }))
      .sort((a, b) => b.value - a.value);

    // For demonstration, let's assume cluster1 is index 0, cluster2 is index 1, etc.
    // In reality, your data might map differently.

    // 4) Calculate "Active Holding" (sum of all but the largest cluster)
    const totalExcludingMax = chartData.slice(1).reduce((sum, c) => sum + c.value, 0);

    // 5) Update the text under the chart
    if (chartStatElement) {
      if (totalExcludingMax > 0) {
        chartStatElement.textContent = `${totalExcludingMax.toFixed(2)}%`;
      } else {
        chartStatElement.textContent = 'No Data';
      }
    }

    // Mark the first as "Others"
    if (chartData[0]) {
      chartData[0].value = 100 - totalExcludingMax;
      chartData[0].wallets = [];
      chartData[0].label = 'Others';
    }
    for (let i = 1; i < chartData.length; i++) {
      chartData[i].label = `Cluster ${i}`;
    }

    // 6) Fill left Data Field table as an example:
    // Suppose we only track up to 3 clusters for demonstration:
    // (You can adapt to as many as you need)
    // "Active cluster" = totalExcludingMax
    document.getElementById('activeClusterPercent').textContent =
      `${totalExcludingMax.toFixed(2)}%`;

    // cluster1 data
    if (chartData[1]) {
      document.getElementById('cluster1Wallets').textContent =
        chartData[1].wallets.length;
      document.getElementById('cluster1Percent').textContent =
        `${chartData[1].value.toFixed(2)}%`;
    } else {
      document.getElementById('cluster1Wallets').textContent = '0';
      document.getElementById('cluster1Percent').textContent = '0%';
    }

    // cluster2 data
    if (chartData[2]) {
      document.getElementById('cluster2Wallets').textContent =
        chartData[2].wallets.length;
      document.getElementById('cluster2Percent').textContent =
        `${chartData[2].value.toFixed(2)}%`;
    } else {
      document.getElementById('cluster2Wallets').textContent = '0';
      document.getElementById('cluster2Percent').textContent = '0%';
    }

    // cluster3 data
    if (chartData[3]) {
      document.getElementById('cluster3Wallets').textContent =
        chartData[3].wallets.length;
      document.getElementById('cluster3Percent').textContent =
        `${chartData[3].value.toFixed(2)}%`;
    } else {
      document.getElementById('cluster3Wallets').textContent = '0';
      document.getElementById('cluster3Percent').textContent = '0%';
    }

    // 7) Build polar chart data
    const backgroundColors = chartData.map((item, index) => {
      if (index === 0) return 'rgba(128, 128, 128, 1)'; // grey for "Others"
      const intensity = Math.max(0, 255 - index * 25);
      return `rgba(${intensity}, 28, 36, 1)`;
    });

    // Custom radius array if you want to shrink the "Others" segment
    const radiusData = chartData.map((item, index) => (index === 0 ? 0.4 : 1));

    // Destroy old chart instance if any
    if (clusterChart instanceof Chart) {
      clusterChart.destroy();
    }

    clusterChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: chartData.map((x) => x.label || 'Others'),
        datasets: [
          {
            data: chartData.map((x) => x.value),
            backgroundColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const group = chartData[context.dataIndex];
                const count = group.wallets.length;
                return `${group.value.toFixed(2)}% (${count} wallets)`;
              },
            },
          },
        },
        scales: {
          r: {
            ticks: { display: false, maxTicksLimit: 6 },
            max: 100,
          },
        },
      },
      plugins: [
        {
          id: 'customRadiusAndArc',
          beforeDraw(chart) {
            const { ctx } = chart;
            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0);
            const maxRadius = Math.min(chart.width, chart.height) / 2;

            meta.data.forEach((arc, idx) => {
              const customRadius = radiusData[idx] || 1;
              arc.outerRadius = maxRadius * customRadius;
            });

            let currentAngle = Math.PI / 2;
            const totalValue = dataset.data.reduce((a, b) => a + b, 0);

            meta.data.forEach((arc, idx) => {
              const value = dataset.data[idx];
              const percentage = value / totalValue;
              const angle = percentage * Math.PI * 2;
              arc.startAngle = currentAngle;
              arc.endAngle = currentAngle + angle;
              currentAngle = arc.endAngle;
            });
          },
        },
      ],
    });
  }

  // Polling function to fetch data
  async function fetchClusterData() {
    try {
      const response = await fetch(
        'http://ec2-3-80-88-97.compute-1.amazonaws.com:3000/fetchData'
      );
      if (!response.ok) {
        throw new Error(`Cluster fetch error: ${response.status}`);
      }
      const data = await response.json();
      updateClusterChart(data);
    } catch (error) {
      console.error('[Clusters] Error:', error);
    }
  }

  // Initial fetch
  fetchClusterData();

  // Poll every 10 seconds
  setInterval(fetchClusterData, 10000);
});
