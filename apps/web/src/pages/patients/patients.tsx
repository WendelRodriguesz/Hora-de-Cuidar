import React from "react";
import style from "./patients.module.scss";

const Patients: React.FC = () => {
  const patients = [
    {
      id: 1,
      name: "Maria José Oliveira Novais Silva",
      phone: "(88) 9 9999-9999",
      lastConsult: "01/01/2022",
      status: "Finished treatment",
      statusClass: "finished",
    },
    {
      id: 2,
      name: "Maria José Oliveira Novais Silva",
      phone: "(88) 9 9999-9999",
      lastConsult: "01/01/2022",
      status: "Return patient",
      statusClass: "return",
    },
    {
      id: 3,
      name: "Maria José Oliveira Novais Silva",
      phone: "(88) 9 9999-9999",
      lastConsult: "01/01/2022",
      status: "Scheduled consultation",
      statusClass: "scheduled",
    },
    {
      id: 4,
      name: "Maria José Oliveira Novais Silva",
      phone: "(88) 9 9999-9999",
      lastConsult: "01/01/2022",
      status: "In treatment",
      statusClass: "in-progress",
    },
  ];

  return (
    <div className="stylesd.patients-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>HORA DE CUIDAR</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Appointments</li>
            <li className="active">Patients</li>
            <li>Doctors</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="patients-content">
        <header className="header">
          <h2>Patients</h2>
          <button className="add-patient-button">+ Add Patient</button>
        </header>

        <section className="summary">
          <div className="summary-item">30 Registered Patients</div>
          <div className="summary-item">12 Finished Treatment</div>
          <div className="summary-item">20 In Treatment</div>
          <div className="summary-item">3 Return Period</div>
          <div className="summary-item">25 Scheduled Consultations</div>
        </section>

        <section className="patients-table">
          <div className="table-header">
            <input type="text" placeholder="Search" className="search-bar" />
            <button className="filter-button">Filter</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Last Consultation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.lastConsult}</td>
                  <td>
                    <span className={`status ${patient.statusClass}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-button">👁</button>
                    <button className="edit-button">✏️</button>
                    <button className="delete-button">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Patients;
