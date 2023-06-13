import React, { useContext } from 'react'
import { Disclosure } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Header() {
    const { user, setUser } = useContext(UserContext);
    const nav = useNavigate()
    let navigation = []
    switch (user?.role) {
        case "CUSTOMER":
            navigation = [
                { name: 'Properties', to: '/properties', current: false },
                { name: 'Favorites', to: '/customer/favorites', current: false },
                { name: 'Offers', to: '/customer/offers', current: false },
            ]
            break;
        case "OWNER":
            navigation = [
                { name: 'Properties', to: '/properties', current: false },
                { name: 'My Properties', to: '/owner/properties', current: false },
                { name: 'Offers', to: '/owner/offers', current: false },
            ]
            break;
        case "ADMIN":
            navigation = [
                { name: 'Properties', to: '/properties', current: false },
                { name: 'Owners', to: '/admin/owners', current: false },
                { name: 'Customers', to: '/admin/customers', current: false },
            ]
            break;

        default:
            navigation = [
                { name: 'Properties', to: '/properties', current: false }
            ]
            break;
    }

    const logout = () => {
        setUser(null);
        localStorage.clear();
        nav("/");
    }

    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {() => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <img
                                            className="hidden h-8 w-auto lg:block"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />
                                        <Link to="/" className="ml-3 mr-5 text-white font-semibold">Housing.com</Link>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.to}
                                                    className={classNames(
                                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    {!user && (
                                        <>
                                            <Link to="login"
                                                type="button"
                                                className="rounded-md px-3 py-1.5 bg-gray-900 p-1 text-gray-300 hover:text-white focus:outline-none "
                                            >
                                                Login
                                            </Link>
                                            <Link to="signup"
                                                type="button"
                                                className="ml-3 rounded-md px-3 py-1.5 bg-gray-900 p-1 text-gray-300 hover:text-white focus:outline-none "
                                            >
                                                Signup
                                            </Link>
                                        </>

                                    )}
                                    {user && (
                                        <div className="flex items-center">
                                            <span className='text-gray-300 mr-3'>Hello, {user.firstName} </span>
                                            { user && user?.role === "OWNER" && <Link to="/owner/properties/add" className="mr-3 self-end rounded-md px-5 py-1.5 bg-sky-700 p-1 text-white hover:text-white focus:outline-none ">Add Property +</Link> }

                                            <button onClick={logout} to="login"
                                                type="button"
                                                className="rounded-md px-3 py-2 bg-gray-900 p-1 text-gray-300 hover:text-white focus:outline-none "
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </>
                )}
            </Disclosure>

        </>
    )
}

export default Header