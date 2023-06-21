import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import userAxios from "../util/axios";
import { UserContext } from "../context/UserContext";

function PropertyDetails() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [property, setProperty] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (property) {
      fetch(property.photos[0]?.link)
        .then((response) => response.blob())
        .then((blob) => {
          setImageSrc(URL.createObjectURL(blob));
        })
        .catch((error) => console.error(error));
    }
  }, [property]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.log(err));
    if (user) {
      console.log(user);
      fetchFavs();
    }
  }, []);

  const fetchFavs = () => {
    userAxios
      .get(`http://localhost:8080/api/v1/customers/${user.id}/favorites`)
      .then(({ data }) => {
        const ids = data.map((dt) => dt.id);
        const includes = ids.includes(parseInt(id));
        setIsFav(includes);
      })
      .catch((err) => console.log(err));
  };

  const toggleFav = () => {
    if (isFav) {
      userAxios
        .delete(
          `http://localhost:8080/api/v1/customers/${user.id}/favorites/${id}`
        )
        .then(() => {
          setIsFav(false);
        })
        .catch((err) => console.log(err));
    } else {
      userAxios
        .post(`http://localhost:8080/api/v1/customers/${user.id}/favorites`, {
          customer_id: user.id,
          property_id: id,
        })
        .then(() => {
          setIsFav(true);
        });
    }
  };

  return (
    <>
      {property && (
        <div className="border rounded-md shadow-md p-4 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={imageSrc}
                alt=""
                className="h-64 w-full object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    For {property.listingType}
                  </h1>
                  <h1 className="text-3xl font-bold text-gray-900">
                    ${property.price?.toLocaleString()}
                  </h1>
                  <div className="mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={
                        property.propertyStatus === "AVAILABLE"
                          ? "rgb(54, 179, 150)"
                          : property.propertyStatus === "PENDING"
                          ? "#FFC300"
                          : "#C70039"
                      }
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <label className="text-gray-600">
                      {property.propertyStatus}
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <h1 className="text-lg font-semibold text-gray-800">
                      {property.propertyType}
                    </h1>
                  </div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    Built Year: {property.builtYear?.split("-")[0]}
                  </h1>
                  <h1 className="text-gray-600">{property.lotSize} sq. feet</h1>
                </div>
                <p className="text-gray-600">
                  {property.address?.street}, {property.address?.city},{" "}
                  {property.address?.state} {property.address?.zipcode}
                </p>
                <div className="flex justify-between">
                  <p>
                    <strong>{property.bedrooms}</strong> bed
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{property.bathrooms}</strong> bath
                  </p>
                </div>
              </div>
              <div className="flex mt-4 justify-end">
                {(!user || (user && user.role === "CUSTOMER")) && (
                  <Link
                    to={
                      user
                        ? "/customer/offers/add/" + property.id
                        : "/login?return=/properties/" + id
                    }
                    className="rounded-md bg-blue-600 text-white font-semibold px-4 py-2 mr-2 hover:bg-blue-700 transition duration-300"
                  >
                    Make an Offer
                  </Link>
                )}
                {user && user.role === "CUSTOMER" && (
                  <button
                    onClick={toggleFav}
                    className={`rounded-md ${
                      isFav ? "bg-red-600" : "bg-green-600"
                    } text-white font-semibold px-4 py-2 hover:bg-opacity-80 transition duration-300`}
                  >
                    {isFav ? "Remove from Favorites" : "Add to Favorites"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-lg font-semibold text-gray-800">
              More Details
            </h1>
            <p>
              Pets: {property.propertyDetails?.pet ? "Allowed" : "Not Allowed"}
            </p>
            <p>Heater: {property.propertyDetails?.heater}</p>
            <p>Cooling: {property.propertyDetails?.cooling}</p>
            <p>Deposit: ${property.propertyDetails?.deposit}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyDetails;
