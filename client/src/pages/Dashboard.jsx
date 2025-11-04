import StatCard from "../components/StatCard";
import AreaMini from "../components/charts/AreaMini";
import DonutMini from "../components/charts/DonutMini";
import Table from "../components/Table";
import styles from "../styles/dashboard.module.css"; // 👈 أضف هالسطر!

export default function Dashboard() {
  return (  
    <>
      {/* 👇 استخدم styles بدل className العادي */}
          <div className={styles.pageContent}>
      <div className={styles.cards}>
        <StatCard title="Total Vehicles" value="150" />
        <StatCard title="Total Sales" value="$120K" />
        <StatCard title="Revenue Growth" value="5.2%" />
        <StatCard title="Employees" value="24" />
      </div>

      <div className={styles.split}>
        <div className={styles.widget}>
          <h4>Sales Over Time</h4>
          <AreaMini />
        </div>
        <div className={styles.widget}>
          <h4>Vehicle Type Distribution</h4>
          <DonutMini />
        </div>
      </div>

      <div className={styles.grid2}>
        <Table
          columns={["User", "Action", "Vehicle", "Date"]}
          rows={[
            { user: "Anna", action: "Added", vehicle: "Vehicle", date: "2024-04-01" },
            { user: "John", action: "Edited", vehicle: "Vehicle", date: "2024-04-02" },
          ]}
        />
        <Table
          columns={["User", "Action", "Date"]}
          rows={[
            { user: "Anna", action: "Added", date: "2024-04-01" },
            { user: "John", action: "Deleted", date: "2024-04-03" },
          ]}
        />
      </div>
      </div>
    </>
  );
}