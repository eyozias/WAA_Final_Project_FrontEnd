import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import userAxios from '../util/axios'
import Property from './Property';
import Dropdown from './views/Dropdown';
import { UserContext } from '../context/UserContext';

function Properties() {
    const BASE_URL = `http://localhost:8080/api/v1/properties`;
    const [properties, setProperties] = useState([]);
    const propertyTypes = ["HOUSE", "APARTMENT", "CONDO", "TOWNHOUSE"];
    const [text, setText] = useState('')
    const listingTypes = ["RENT", "SALE"];
    const numbers = [1, 2, 3, 4, 5]
    const [params, setParams] = useState({});
    const [favs, setFavs] = useState([])
    const { user } = useContext(UserContext)

    useEffect(() => {
        axios.get(BASE_URL)
            .then(res => setProperties(res.data))
            .catch(err => console.log(err))
        
        if (user && user.role === "CUSTOMER") {
            fetchFavs();
        }
    }, [])

    useEffect(() => {
        if (!text) {
            setParams(prev => {
                delete prev.city;
                delete prev.state;
                return { ...prev }
            })
            return;
        }
        const query = {};
        if (text.length === 2) {
            query.state = text;
        } else if (text.includes(',')) {
            let splitted = text.split(',')
            query.city = splitted[0].trim();
            query.state = splitted[1].trim();
        } else {
            query.city = text
        }
        setParams(prev => {
            delete prev.city;
            delete prev.state;
            return { ...prev, ...query }
        })
    }, [text])


    const onFilter = () => {
        axios.get(BASE_URL, { params })
            .then(res => setProperties(res.data))
            .catch(err => console.log(err));
        if (user && user.role === "CUSTOMER") {
            fetchFavs();
        }
    }

    const fetchFavs = () => {
        userAxios.get(`http://localhost:8080/api/v1/customers/${user.id}/favorites`)
            .then(({ data }) => {
                const ids = data.map(dt => dt.id)
                console.log(ids)
                setFavs(ids)
            })
            .catch(err => console.log(err))
    }

    const checkIfFav = (pptId) => {
        return favs.includes(pptId)
    }

    const onClicked = (query) => {
        setParams(prev => ({ ...prev, ...query }))
    }

    const toggleFav = (id, isFav) => {
        if (isFav) {
            userAxios.delete(`http://localhost:8080/api/v1/customers/${user.id}/favorites/${id}`)
                .then(() => {
                    const ids = favs.filter(fav => fav !== id)
                    console.log(ids)
                    setFavs(ids)
                })
                .catch(err => console.log(err))
        } else {
            userAxios.post(`http://localhost:8080/api/v1/customers/${user.id}/favorites`, { customer_id: user.id, property_id: id })
                .then(() => {
                    const ids = [...favs, id]
                    console.log(ids)
                    setFavs(ids)
                })
        }
    }

    return (
        <div className="">
            <div className="flex justify-between mb-6 items-center">
                <input value={text} onChange={({ target }) => setText(target.value)} type="text" className="border gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    placeholder="city, state or both" />
                <Dropdown query={params} value="propertyType" title="Property Type" items={propertyTypes} onClicked={onClicked} />
                <Dropdown query={params} value="listingType" title="Listing Type" items={listingTypes} onClicked={onClicked} />
                <Dropdown query={params} value="minBedRooms" title="Min Beds" items={numbers} onClicked={onClicked} />
                <Dropdown query={params} value="maxBedRooms" title="Max Beds" items={numbers} onClicked={onClicked} />
                <Dropdown query={params} value="minBathRooms" title="Min Baths" items={numbers} onClicked={onClicked} />
                <Dropdown query={params} value="maxBathRooms" title="Max Baths" items={numbers} onClicked={onClicked} />
                <button onClick={onFilter} className="rounded-md px-5 py-1.5 bg-sky-700 p-1 text-white hover:text-white focus:outline-none ">Filter</button>
                <button onClick={() => { setParams({}); setText('') }} className="text-sky-700">Clear</button>
            </div>
            <div className="grid gap-8 grid-cols-3 grid-rows-3">
                {properties.map(pro => <Property isFav={checkIfFav(pro.id)} key={pro.id} data={pro} toggleFav={toggleFav} />)}
            </div>
        </div>
    )
}

export default Properties