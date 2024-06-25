import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';

type OrderState = {
    customerId: string;
    sellerId: string;
    storeId: string;
    truckIds: string[];
    isDiscount: boolean;
};

export default function NewProduct() {
    const [customers, setCustomers] = useState<{ id: string, name: string }[]>([]);
    const [sellers, setSellers] = useState<{ id: string, name: string, store :{ id: string,name: string, location:string}}[]>([]);
    const [trucks, setTrucks] = useState<{ id: string, model: string, name:string }[]>([]);
    const [stores, setStores] = useState<{id: string, name: string, location: string}[]>([]);
    const [order, setOrder] = useState<OrderState>({
        customerId: '',
        sellerId: '',
        storeId: '',
        truckIds: [],
        isDiscount: false
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data))
            .catch(error => console.error('Error fetching customers:', error));

        fetch('http://localhost:8080/api/stores')
            .then(response => response.json())
            .then(data => setStores(data))
            .catch(error => console.error('Error fetching stores:', error));

        fetch('http://localhost:8080/api/sellers')
            .then(response => response.json())
            .then(data => {
                //console.log('Sellers fetched:', data); // Debugging
                setSellers(data);
            })
            .catch(error => console.error('Error fetching sellers:', error));

        fetch('http://localhost:8080/api/trucks')
            .then(response => response.json())
            .then(data => setTrucks(data))
            .catch(error => console.error('Error fetching trucks:', error));
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder(prevOrder => ({
            ...prevOrder,
            [name]: value
        }));
    };



    const handleTruckChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { options } = e.target;
        const truckIds: string[] = [];
        for (const option of options) {
            if (option.selected) {
                truckIds.push(option.value);
            }
        }
        setOrder(prevOrder => ({
            ...prevOrder,
            truckIds
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Order before submit:', order); // Debugging
        fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        }).then(response => response.json()).then(data => {
            // Manejar respuesta
            console.log('Order:', order);
            console.log('Response:', data);
        }).catch(error => console.error('Error submitting order:', error));
    };

    return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-4xl font-black text-slate-500'>
                    Registrar Pedidos
                </h2>
                <Link
                    to="/"
                    className='rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500'
                >
                    Volver a Pedidos
                </Link>
            </div>


            <form className="mt-10" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="text-gray-800" htmlFor="customerId">Cliente:</label>
                    <select
                        id="customerId"
                        name="customerId"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        value={order.customerId}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un cliente</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-gray-800" htmlFor="customerId">Tienda:</label>
                    <select
                        id="storeId"
                        name="storeId"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        value={order.storeId}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una tienda</option>
                        {stores.map(stores => (
                            <option key={stores.id} value={stores.id}>{stores.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-gray-800" htmlFor="sellerId">Vendedor:</label>
                    <select
                        id="sellerId"
                        name="sellerId"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        value={order.sellerId}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un vendedor</option>
                        {sellers.map(seller => (
                            <option key={seller.id} value={seller.id}>{seller.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-gray-800" htmlFor="truckIds">Camiones:</label>
                    <select
                        id="truckIds"
                        name="truckIds"
                        multiple
                        className="mt-2 block w-full p-3 bg-gray-50"
                        value={order.truckIds}
                        onChange={handleTruckChange}
                    >
                        {trucks.map(truck => (
                            <option key={truck.id} value={truck.id}>{truck.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-gray-800" htmlFor="isDiscount">Descuento:</label>
                    <input
                        id="isDiscount"
                        type="checkbox"
                        className="mt-2"
                        name="isDiscount"
                        checked={order.isDiscount}
                        onChange={(e) => setOrder(prevOrder => ({
                            ...prevOrder,
                            isDiscount: e.target.checked
                        }))}
                    />
                </div>

                <input
                    type="submit"
                    className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                    value="Registrar Pedido"
                />
            </form>
        </>
    );
}