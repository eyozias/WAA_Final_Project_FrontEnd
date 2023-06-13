import React, { useContext, useEffect, useState } from 'react'
import userAxios from '../../util/axios'
import { UserContext } from '../../context/UserContext'
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline'

function CustomerOffers() {
  const [offers, setOffers] = useState([])
  const { user } = useContext(UserContext);


  useEffect(() => {
    if (user) {
      userAxios.get(`http://localhost:8080/api/v1/customers/${user?.id}/offers`)
        .then(res => setOffers(res.data))
        .catch(err => console.log(err))
    }
  }, [user])

  const onDelete = (offerId) => {
    console.log(offerId)
    userAxios.delete(`http://localhost:8080/api/v1/customers/${user?.id}/offers/${offerId}`)
      .then(() => {
        const newOffers = offers.filter(o => o.id !== offerId)
        setOffers(newOffers);
      })
      .catch(err => console.log(err))
  }

  const onEdit = (offerId) => {
    const price = document.getElementById(offerId).value
    userAxios.put(`http://localhost:8080/api/v1/customers/${user?.id}/offers/${offerId}`, { price })
      .then(() => alert("Editted"))
      .catch(err => console.log(err))
  }

  const getClasses = (val) => {
    switch (val) {
      case "WAITING":
        return "bg-yellow-100 text-yellow-700"
      case "ACCEPTED":
        return "bg-green-200 text-green-700"
      case "DECLINE":
        return "bg-red-200 text-red-700"
      default:
        break;
    }
  }
// vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8
  const onDownload = () => {
    let csvRows = []
    let data = offers.map(o => {
      return {
        id: o.id,
        price: o.price,
        status: o.status,
        submittedAt: o.submittedAt,
        propertyPrice: o.property.price,
        propertyStatus: o.property.propertyStatus,
        propertyType: o.property.propertyType,
      }
    })
    const header = ["Id", "Offer Price", "Offer Status", "Offer Date", "Property Price", "Property Status", "Property Type"]
    data = data.map(dt => Object.values(dt).join(","))
    csvRows.push(header.join(','))
    csvRows = [...csvRows, ...data]
    data = csvRows.join('\n')
    // file object
    const file = new Blob([data], { type: 'application/csv' });

    // anchor link
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "100ideas-" + Date.now() + ".csv";

    // simulate link click
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">My Offers</h1>
        {offers.length > 0 && (
          <button onClick={onDownload} className="border rounded px-3 py-1.5 flex items-center hover:border-gray-300 hover:shadow-sm transition">
            Download
            <ArrowDownOnSquareStackIcon className="h-6 w-6 ml-2" />
          </button>
        )}
      </div>

      <div className="mt-8 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Listing Type
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Property Price
              </th>
              <th scope="col" className="px-6 py-3">
                Offer Price
              </th>
              <th scope="col" className="px-6 py-3">
                Offer Status
              </th>
              <th scope="col" className="px-6 py-3">
                Property Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="[&>*:nth-child(even)]:bg-gray-100">
            {offers.map(o => (
              <tr key={o.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {o.property?.listingType}
                </th>
                <td className="px-6 py-4">
                  {o.property?.address?.street} {o.property?.address?.city}, {o.property?.address?.state}
                </td>
                <td className="px-6 py-4">
                  ${o.property?.price}
                </td>
                <td className="px-6 py-4">
                  <input id={o.id} type="text" className='border py-1 px-0.5' defaultValue={o.price} />
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-xl font-medium text-xs ${getClasses(o.status)}`}>{o.status}</span>
                </td>
                <td className="px-6 py-4">
                  {o.property?.propertyStatus}
                </td>
                <td className="px-6 py-4">
                  <button disabled={o.status === 'DECLINED' || o.property?.propertyStatus === 'RENTED' || o.property?.propertyStatus === 'SOLD'} onClick={() => onEdit(o.id)} className="font-medium text-blue-600 dark:text-blue-500 mr-3 enabled:hover:underline disabled:text-gray-500">Edit</button>
                  <button disabled={o.status === 'DECLINED' || o.property?.propertyStatus === 'RENTED' || o.property?.propertyStatus === 'SOLD' || o.property?.propertyStatus === 'CONTINGENT'} onClick={() => onDelete(o.id)} className="font-medium text-red-600 dark:text-blue-500 enabled:hover:underline disabled:text-gray-500">Delete</button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

    </div>
  )
}

export default CustomerOffers