import { useEffect, useState } from "react";
import { FiMinus, FiSave, FiCalendar, FiPlus } from "react-icons/fi";
import axios from "axios";
import Chart from "react-google-charts";

export const options = {
  title: "Number of Reservations",
  curveType: "function",
  legend: { position: "bottom" },
};

export const DashboardOffer = (props) => {
  const [opacity, setOpacity] = useState();
  const [option, setOption] = useState("Hourly");

  const changeOpacity = () => {};

  const handleDelete = async () => {
    const deletePlace = async () => {
      await axios.delete(`http://localhost/api/TravelPoints/${id}`);
    };

    await deletePlace();
    window.location.reload(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      setAudioBytes(base64String);
    };

    reader.readAsDataURL(file);
  };

  const {
    id,
    price: initialPrice,
    textDescription: initialDescription,
    location: initialLocation,
    audioBytes: initialAudioBytes,
    reviews: initialReviews,
    offers: initialOffers,
    reservations: initialReservations,
  } = props;

  const [title, setTitle] = useState(initialLocation);
  const [description, setDescription] = useState(initialDescription);
  const [locationCountry, setLocationCountry] = useState(`${initialLocation}`);
  const [price, setPrice] = useState(initialPrice);
  const [audioBytes, setAudioBytes] = useState(initialAudioBytes);
  const [reviews, setReviews] = useState(initialReviews);
  const [offers, setOffers] = useState(initialOffers);
  const [reservations, setReservations] = useState(initialReservations);
  const [barChartData, setBarChartData] = useState([
    ["Hour", "Number of Reservations"],
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (option === "Hourly") {
        try {
          const response = await axios.get(
            `http://localhost/api/TravelPoints/FrequencyList/${id}?frequencyType=${option}`
          );
          const data = await response.data;
          const newBarChartData = [["Hour", "Number of Reservations"]];

          data.forEach((element) => {
            const hour = element.date.split("T")[1].split(":")[0];
            const reservations = element.numberOfReservations;
            if (newBarChartData.filter((row) => row[0] === hour).length === 0) {
              newBarChartData.push([hour, reservations]);
            } else {
              newBarChartData.forEach((row) => {
                if (row[0] === hour) {
                  row[1] += reservations;
                }
              });
            }
          });
          for (let i = 0; i < 24; i++) {
            if (newBarChartData.filter((row) => row[0] === i.toString()).length === 0) {
              newBarChartData.push([i.toString(), 0]);
            }
          }
          newBarChartData.sort((a, b) => {
            return a[0] - b[0];
          });
          setBarChartData(newBarChartData);
        } catch (error) {
          console.error("Failed to fetch places:", error);
        }
      } else {
        try {
          const response = await axios.get(
            `http://localhost/api/TravelPoints/FrequencyList/${id}?frequencyType=${option}`
          );
          const data = await response.data;
          const newBarChartData = [["Month", "Number of Reservations"]];

          data.forEach((element) => {
            const month = element.date.split("T")[0].split("-")[1];
            const reservations = element.numberOfReservations;
            if (
              newBarChartData.filter((row) => row[0] === month).length === 0
            ) {
              newBarChartData.push([month, reservations]);
            } else {
              newBarChartData.forEach((row) => {
                if (row[0] === month) {
                  row[1] += reservations;
                }
              });
            }
          });
          for (let i = 1; i <= 12; i++) {
            if (newBarChartData.filter((row) => row[0] === `0${i.toString()}`).length === 0) {
              newBarChartData.push([`0${i.toString()}`, 0]);
            }
          }
          newBarChartData.sort((a, b) => {
            return a[0] - b[0];
          });
          setBarChartData(newBarChartData);
        } catch (error) {
          console.error("Failed to fetch places:", error);
        }
      }
    };

    fetchData();
  }, [option]);

  const handleSave = async () => {
    const parts = locationCountry.split(",");
    const location = parts[0].trim();

    let finalTripDealPrice = price;

    try {
      const updateData = {
        id,
        location: location,
        textDescription: description,
        price: price,
        audioBytes: audioBytes,
        offers: offers,
        reviews: initialReviews,
        reservations: initialReservations,
      };

      await axios.post(`http://localhost/api/TravelPoints/Add`, updateData);
      alert("Save successful!");
    } catch (error) {
      console.error("Failed to update place:", error);
      alert("Save failed!");
    }
  };

  const handleUpdate = async () => {
    const parts = locationCountry.split(",");
    const location = parts[0].trim();
    const country = parts.length > 1 ? parts[1].trim() : "";

    let finalTripDealPrice = price;

    try {
      const updateData = {
        id,
        location: location,
        textDescription: description,
        price: price,
        audioBytes: audioBytes,
        offers: offers,
        reviews: initialReviews,
        reservations: initialReservations,
      };

      await axios.put(
        `http://localhost/api/TravelPoints/Update/${id}`,
        updateData
      );
      alert("Update successful!");
    } catch (error) {
      console.error("Failed to update place:", error);
      alert("Update failed!");
    }
  };

  const handleOfferDateChange = (offerId, field, value) => {
    const dateValue = new Date(value).toISOString();
    setOffers((offers) =>
      offers.map((offer) => {
        if (offer.id === offerId) {
          return { ...offer, [field]: dateValue };
        }
        return offer;
      })
    );
  };

  const handleOfferChange = (offerId, field, value) => {
    setOffers((offers) =>
      offers.map((offer) => {
        if (offer.id === offerId) {
          return { ...offer, [field]: value };
        }
        return offer;
      })
    );
  };

  return (
    <div
      className="bg-[rgba(217,237,130,0.1)] flex items-center gap-20 py-8 px-24 flex-shrink-0 self-stretch"
      onClick={changeOpacity}
      style={{
        background: `rgb(217, 237,130, ${opacity})`,
      }}
    >
      <div className="flex items-start relative gap-[2.5em] ">
        <div className="bg-gradient-to-b from-transparent to-[#102E38] w-[327px] h-[452px] flex items-start justify-center relative rounded-lg">
          <img
            src={`https://source.unsplash.com/327x452/?${locationCountry}`}
            className="absolute top-0 left-0 w-[327px] h-[452px] rounded-lg"
          />
          <div className="relative top-60 text-center flex flex-col items-center gap-4 z-10">
            <span className="text-white font-[PlayfairDisplay] text-[37px] font-medium">
              {title}
            </span>
            <div className="flex items-start">
              <span className="text-white font-[Inter] text-[18px] font-medium self-center">
                {locationCountry}
              </span>
            </div>
            <span className="text-white font-[Inter] text-[14px] font-normal">
              {`${Math.floor(Math.random() * 1000)} want to travel here`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-16">
        <button>
          <FiMinus
            className="text-white bg-red-600 rounded-md w-8 h-8 relative left-[80em]"
            onClick={handleDelete}
          />
        </button>
        <div className="flex flex-row relative">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[#141B34] font-[Inter] text-[37px] font-bold bg-inherit resize-none"
          >
            {title}
          </textarea>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col items-start gap-12">
            <div className="flex items-start gap-20">
              <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
                Description:
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold bg-inherit resize-none"
              >
                {description}
              </textarea>
            </div>
            <div className="flex items-start gap-[105px]">
              <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
                Location:
              </span>
              <textarea
                value={locationCountry}
                onChange={(e) => setLocationCountry(e.target.value)}
                className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold bg-inherit resize-none"
              >
                {locationCountry}
              </textarea>
            </div>
            <div className="flex items-start gap-20">
              <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
                Price/Night:
              </span>
              <textarea
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold bg-inherit resize-none"
              >
                {price}
              </textarea>
            </div>
            <div className="flex items-start gap-5">
              <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
                Audio File:
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold bg-inherit resize-none"
              />
            </div>
            <div className="flex items-start gap-5">
              <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
                Offers:
              </span>
              <div className="justify-center flex flex-row items-center gap-10">
                {offers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="flex flex-col bg-red-200 rounded-xl p-4 font-bold"
                  >
                    <input
                      type="text"
                      value={offer.price}
                      onChange={(e) =>
                        handleOfferChange(offer.id, "price", e.target.value)
                      }
                      className="bg-red-200"
                    />
                    <input
                      type="date"
                      value={new Date(offer.startDate)
                        .toISOString()
                        .substring(0, 10)}
                      onChange={(e) =>
                        handleOfferDateChange(
                          offer.id,
                          "startDate",
                          e.target.value
                        )
                      }
                      className="bg-red-200"
                    />
                    <input
                      type="date"
                      value={new Date(offer.endDate)
                        .toISOString()
                        .substring(0, 10)}
                      onChange={(e) =>
                        handleOfferDateChange(
                          offer.id,
                          "endDate",
                          e.target.value
                        )
                      }
                      className="bg-red-200"
                    />
                  </div>
                ))}

                <FiPlus
                  className="w-16 h-16 bg-red-200 rounded-3xl p-4"
                  onClick={() => {
                    setOffers([
                      {
                        id: {
                          timestamp: 0,
                          machine:0,
                          pid:0,
                          increment:0,
                          creationTime: new Date().toISOString()
                        },
                        price: 0,
                        startDate: new Date(),
                        endDate: new Date(),
                      },
                      ...offers,
                    ]);
                  }}
                />
              </div>
            </div>
            <div className="flex items-start gap-5">
              <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
                Reservations:
              </span>
              {reservations.map((reservation, id) => (
                <div>{reservation.startDate}</div>
              ))}
            </div>
            <button>
              <FiSave
                className="text-[#141B34] relative left-[70em] bottom-[55.7em] rounded-md w-10 h-10"
                onClick={() => {
                  console.log(id);
                  if (id.includes("temp")) {
                    handleSave();
                  } else {
                    handleUpdate();
                  }
                }}
              />
            </button>
          </div>
          <div className="flex flex-col w-[600px] relative bottom-20">
            <select
              onChange={(e) => setOption(e.target.value)}
              className="w-full bg-inherit text-xl font-semibold text-[#141B34] font-[Inter] text-center"
            >
              <option value="Hourly">Peak Hours for Reservations</option>
              <option value="Monthly">Peak Months for Reservations</option>
            </select>
            <Chart
              chartType="BarChart"
              width="100%"
              height="100%"
              data={barChartData}
              options={options}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOffer;
