"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import ApexCharts dynamically to avoid SSR issues in Next.js
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Dashboard = ({ users, posts, comments }) => {
  // State to handle window object access (for client-side rendering)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate statistics
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const totalComments = comments.length;

  // Calculate posts per user
  const postsPerUser = users
    .map((user) => {
      const userPosts = posts.filter((post) => post.userId === user.id);
      return {
        name: user.name,
        count: userPosts.length,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Calculate comments per user
  const commentsPerUser = users
    .map((user) => {
      const userComments = comments.filter(
        (comment) => comment.email.toLowerCase() === user.email.toLowerCase()
      );
      return {
        name: user.name,
        count: userComments.length,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Calculate comments per post (top 10)
  const commentsPerPost = posts
    .slice(0, 10)
    .map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post.id
      );
      return {
        title: post.title.substring(0, 20) + "...",
        id: post.id,
        count: postComments.length,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-8 md:py-12">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard title="Total Users" value={totalUsers} color="#3B82F6" />
          <StatsCard title="Total Posts" value={totalPosts} color="#10B981" />
          <StatsCard
            title="Total Comments"
            value={totalComments}
            color="#F59E0B"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Posts per User Chart */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Posts per User
            </h2>
            {isClient && <PostsPerUserChart data={postsPerUser} />}
          </div>

          {/* Comments per Post Chart */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Comments per Post (Top 10)
            </h2>
            {isClient && <CommentsPerPostChart data={commentsPerPost} />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Content Distribution Chart */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Content Distribution
            </h2>
            {isClient && (
              <ContentDistributionChart
                posts={totalPosts}
                comments={totalComments}
              />
            )}
          </div>

          {/* User Activity Chart */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Top 5 Users by Activity
            </h2>
            {isClient && (
              <UserActivityChart
                postsData={postsPerUser.slice(0, 5)}
                commentsData={commentsPerUser.slice(0, 5)}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          Data last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md transition-transform hover:scale-105 duration-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
      <p className="text-4xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
};

// Posts per User Chart
const PostsPerUserChart = ({ data }) => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
      },
      fontFamily: "inherit",
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.map((item) => item.name),
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
          fontFamily: "inherit",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Number of Posts",
        style: {
          fontSize: "14px",
          fontFamily: "inherit",
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    fill: {
      colors: ["#3B82F6"],
      opacity: 0.9,
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.2,
        opacityFrom: 0.9,
        opacityTo: 0.6,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " posts";
        },
      },
      theme: "light",
    },
  };

  const series = [
    {
      name: "Posts",
      data: data.map((item) => item.count),
    },
  ];

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
};

// Comments per Post Chart
const CommentsPerPostChart = ({ data }) => {
  const options = {
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#F59E0B",
        top: 5,
        left: 0,
        blur: 8,
        opacity: 0.2,
      },
      toolbar: {
        show: true,
      },
      fontFamily: "inherit",
      background: "transparent",
    },
    colors: ["#F59E0B"],
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        borderRadius: 4,
        padding: 2,
      },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    xaxis: {
      categories: data.map((item) => item.title),
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
          fontFamily: "inherit",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Number of Comments",
        style: {
          fontSize: "14px",
          fontFamily: "inherit",
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    markers: {
      size: 6,
      colors: ["#F59E0B"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
  };

  const series = [
    {
      name: "Comments",
      data: data.map((item) => item.count),
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

// Content Distribution Chart (Pie)
const ContentDistributionChart = ({ posts, comments }) => {
  const options = {
    chart: {
      type: "pie",
      fontFamily: "inherit",
    },
    labels: ["Posts", "Comments"],
    colors: ["#10B981", "#F59E0B"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "inherit",
      markers: {
        radius: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontFamily: "inherit",
        fontWeight: "bold",
      },
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
      dropShadow: {
        enabled: false,
      },
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "0%",
        },
        expandOnClick: true,
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "inherit",
      },
    },
  };

  const series = [posts, comments];

  return (
    <ReactApexChart options={options} series={series} type="pie" height={350} />
  );
};

// User Activity Chart (Radial)
const UserActivityChart = ({ postsData, commentsData }) => {
  // Combine posts and comments data for top users
  const users = [
    ...new Set([...postsData, ...commentsData].map((item) => item.name)),
  ].slice(0, 5);

  const userData = users
    .map((name) => {
      const posts = postsData.find((item) => item.name === name)?.count || 0;
      const comments =
        commentsData.find((item) => item.name === name)?.count || 0;
      return { name, posts, comments, total: posts + comments };
    })
    .sort((a, b) => b.total - a.total);

  const options = {
    chart: {
      height: 350,
      type: "radialBar",
      fontFamily: "inherit",
      background: "transparent",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
        },
        track: {
          show: true,
          background: "#f2f2f2",
          strokeWidth: "97%",
          opacity: 1,
          margin: 5,
        },
        dataLabels: {
          name: {
            fontSize: "16px",
            fontFamily: "inherit",
            offsetY: -10,
          },
          value: {
            fontSize: "14px",
            fontFamily: "inherit",
            formatter: function (val) {
              return parseInt(val);
            },
          },
          total: {
            show: true,
            label: "Total Activity",
            fontSize: "14px",
            fontFamily: "inherit",
            fontWeight: 600,
            formatter: function (w) {
              return userData.reduce((sum, user) => sum + user.total, 0);
            },
          },
        },
      },
    },
    labels: userData.map((user) => user.name),
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"],
    legend: {
      show: true,
      fontSize: "14px",
      fontFamily: "inherit",
      position: "bottom",
      offsetY: 10,
    },
    stroke: {
      lineCap: "round",
    },
  };

  // Calculate percentage of max activity for each user
  const maxActivity = Math.max(...userData.map((user) => user.total));
  const series = userData.map((user) => (user.total / maxActivity) * 100);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="radialBar"
      height={350}
    />
  );
};

export default Dashboard;
