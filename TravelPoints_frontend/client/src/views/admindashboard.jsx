import React, { useState, useEffect } from "react";
import Navbar from "../components/screen4/navbar";
import DashboardOffer from "../components/dashboard/dashboardoffer";
import { FiPieChart, FiPlus } from "react-icons/fi";
import axios from "axios";
import Modal from "react-modal";
import { Chart } from "react-google-charts";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
  },
};

Modal.setAppElement("body");

const AdminDashboard = (props) => {
  const [places, setPlaces] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [originalPlaces, setOriginalPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [nothing, setNothing] = useState(false);

  const options = {
    title: "Most Popular Destinations",
  };

  function openModal() {
    setModal(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setModal(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/api/TravelPoints");
        const data = await response.data;
        setPlaces(data);
        setOriginalPlaces(data);
      } catch (error) {
        console.error("Failed to fetch places:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPlaces(originalPlaces);
    if (searchTerm) {
      const filteredDestinations = originalPlaces.filter((place) => {
        return place.location.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setPlaces(filteredDestinations);
    }
  }, [searchTerm, originalPlaces]);

  const findMostPopularDestination = async () => {
    try {
      let response;
      response = await axios.get("http://localhost/api/TravelPoints");
      const data = response.data;
      let pieChartData = [];
      pieChartData.push(["Location", "Reservations"]);
      data.forEach((element) => {
        const res = element.reservations.filter((reservation) => {
          if (!startDate || !endDate) {
            return true;
          } else {
            return (
              reservation.startDate >= startDate &&
              reservation.endDate <= endDate
            );
          }
        });
        if (res.length !== 0) {
          pieChartData.push([element.location, res.length]);
        }
      });
      if (pieChartData.length === 1) {
        setNothing(true);
      } else {
        setNothing(false);
      }
      setPieChartData(pieChartData);
    } catch (error) {
      alert("Failed to fetch most popular destination", error);
    }
  };

  const handleAddOffer = () => {
    const newOffer = {
      id: `temp-${Date.now()}`,
      price: 0,
      textDescription: "New Description",
      location: "New Location",
      audioBytes: undefined,
      country: "New Country",
      reviews: [],
      offers: [],
      reservations: [],
    };

    setPlaces([newOffer, ...places]);
  };

  return (
    <div className="w-[100%] min-h-[100vh] overflow-auto flex flex-col items-center relative">
      <Modal
        isOpen={modal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex flex-col w-full h-full text-[#141B34] font-bold text-xl">
          <div className="h-[10%] w-full">
            <span>Start Date:</span>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="w-full h-[50%]"
            ></input>
          </div>
          <div className="h-[10%] w-full">
            <span>End Date:</span>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="w-full h-[50%]"
            ></input>
          </div>
          <button
            onClick={findMostPopularDestination}
            className="relative border-2 border-[#141B34] rounded-lg px-20 py-2 bg-[#141B34]"
          >
            <span className="text-white font-[Inter] text-[18px] font-semibold">
              Filter
            </span>
          </button>
          {nothing && <span className="text-red-500">No data found</span>}

          {!nothing && (
            <Chart
              chartType="PieChart"
              data={pieChartData}
              options={options}
              width={"100%"}
              height={"100%"}
            />
          )}
        </div>
      </Modal>
      <div className="bg-white w-full h-auto flex flex-col items-start gap-0 py-12 overflow-hidden">
        <div className="flex flex-col items-center gap-20 px-1 self-stretch">
          <Navbar textColor="#141B34" setSearchTerm={setSearchTerm} />
        </div>

        <div className="bg-[#141B34] w-full py-8 text-center items-center justify-center text-white text-5xl border-2 cursor-pointer">
          <FiPieChart className="mx-[100vh]" onClick={openModal} />
        </div>
        <div className="bg-[#141B34] w-full py-8 text-center items-center justify-center text-white text-5xl border-2 cursor-pointer">
          <FiPlus className="mx-[100vh]" onClick={handleAddOffer} />
        </div>
        {places.map((place) => (
          <DashboardOffer key={place.id} {...place} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
