import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

type Seller = {
    id: number;
    name: string;
    store: Store;
};

type Store = {
    id: number;
    name: string;
    location: string;
};

type Truck = {
    id: number;
    name: string;
    model: string;
    price: number;
    stock: number;
    discount: number;
    brand: string;
};

type Order = {
    id: number;
    orderDate: string;
    totalPrice: number;
    status: string;
    customer: Customer;
    seller: Seller;
    store: Store;
    trucks: Truck[];
};

export default function Products() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetch('http://localhost:8080/api/orders')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setOrders(data))
            .catch(error => {
                setErrorMessage('Error fetching orders');
                console.error('There was a problem with the fetch operation:', error);
                setTimeout(() => setErrorMessage(''), 10000); // Clear error message after 10 seconds
            });
    }, []);

    return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-4xl font-black text-slate-500'>
                    Lista de Pedidos
                </h2>
                <Link
                    to="productos/nuevo"
                    className='rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500'
                >
                    Crear Pedido
                </Link>
                <Link
                    to="trucks/lista"
                    className='rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500'
                >
                    Ver Lista de Precios
                </Link>
            </div>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <table className="min-w-full mt-6 bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Fecha de Pedido</th>
                        <th className="py-2 px-4 border-b">Cliente</th>
                        <th className="py-2 px-4 border-b">Vendedor</th>
                        <th className="py-2 px-4 border-b">Tienda</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Estatus</th>
                        <th className="py-2 px-4 border-b">Camioneta</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td className="py-2 px-4 border-b">{order.id}</td>
                            <td className="py-2 px-4 border-b">{new Date(order.orderDate).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{order.customer.name}</td>
                            <td className="py-2 px-4 border-b">{order.seller.name}</td>
                            <td className="py-2 px-4 border-b">{order.store.name}</td>
                            <td className="py-2 px-4 border-b">{order.totalPrice}</td>
                            <td className="py-2 px-4 border-b">{order.status}</td>
                            <td className="py-2 px-4 border-b">
                                {order.trucks.map(truck => truck.name).join(', ')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-center my-4 bg-red-600 text-white font-bold p-3 uppercase">
            {children}
        </div>
    );
}