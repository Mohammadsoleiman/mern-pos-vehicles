import React from "react";
import { imgUrl } from "../../../api/vehicles";
import styles from "../../../styles/accountant/vehicles.module.css";

export default function VehicleShow({ vehicle, onClose }) {
  if (!vehicle) return null;

  const infoFields = [
    { label: "VIN", value: vehicle.VIN },
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Year", value: vehicle.year },
    { label: "Type", value: vehicle.type },
    { label: "Condition", value: vehicle.condition },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Cylinders", value: vehicle.cylinders },
    { label: "Fuel Type", value: vehicle.fuelType },
    { label: "Status", value: vehicle.status },
    { label: "Price ($)", value: vehicle.price?.toLocaleString() },
    { label: "Cost ($)", value: vehicle.cost?.toLocaleString() },
    { label: "Maintenance Cost ($)", value: vehicle.maintenanceCost },
    { label: "Fuel Cost ($)", value: vehicle.fuelCost },
    { label: "Purchase Date", value: vehicle.purchaseDate?.slice(0, 10) },
    { label: "Insurance Provider", value: vehicle.insuranceProvider },
    { label: "Insurance Expiry", value: vehicle.insuranceExpiry?.slice(0, 10) },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.large}`}>
        <div className={styles.modalHeader}>
          <h3>Vehicle Details</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Information Grid */}
        <div className={styles.formGrid}>
          {infoFields.map(
            (item, idx) =>
              item.value && (
                <div key={idx} className={styles.formGroup}>
                  <label>{item.label}</label>
                  <input value={item.value} readOnly />
                </div>
              )
          )}

          {/* Color Display */}
          {vehicle.color && (
            <div className={styles.formGroup}>
              <label>Color</label>
              <input type="color" value={vehicle.color} disabled />
            </div>
          )}
        </div>

        {/* Image Gallery */}
        <div className={styles.formGroup}>
          <label>Images</label>
          {vehicle.images?.length ? (
            <div className={styles.imagePreview}>
              {vehicle.images.map((img) => (
                <img
                  key={img}
                  src={imgUrl(img)}
                  alt="Vehicle"
                  className={styles.tableThumb}
                />
              ))}
            </div>
          ) : (
            <p className={styles.noData}>No images uploaded</p>
          )}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
