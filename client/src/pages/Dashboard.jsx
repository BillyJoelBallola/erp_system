import React, { useEffect, useState } from "react";
import { Chart } from 'primereact/chart';
import Summary from "../components/Summary";
import axios from "axios";

const Dashboard = () => {
	const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [summaryData, setSummaryData] = useState({
        sales: 0,
        shipments: 0,
        products: 0,
        employees: 0,
        customers: 0
    }); 

	useEffect(() => {
        let totalSales = 0;
        let totalShipments = 0;
        let totalProducts = 0;
        let totalEmployees = 0;
        let totalCustomers = 0;

		axios.get("/sales").then(({ data }) => {
            data.map((sales) => {
                if(sales.payment === "Paid"){    
                    totalSales += sales.total;
                    setSummaryData((prev) => ({...prev, sales: totalSales}));
                }
            })
		})

		axios.get("/shipments").then(({ data }) => {
            data.map((ship) => {
                if(ship.status === "Completed"){
                    totalShipments = data.length;
                    setSummaryData((prev) => ({...prev, shipments: totalShipments}));
                }
            })
		})

		axios.get("/products").then(({ data }) => {
            totalProducts = data.length;
            setSummaryData((prev) => ({...prev, products: totalProducts}));
		})

		axios.get("/employees").then(({ data }) => {
            totalEmployees = data.length;
            setSummaryData((prev) => ({...prev, employees: totalEmployees}));
		})

		axios.get("/customers").then(({ data }) => {
            totalCustomers = data.length;
            setSummaryData((prev) => ({...prev, customers: totalCustomers}));
		})

	}, [])


    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Sales',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-400'),
                    tension: 0.4
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
		<div className="px-5 py-6">
			<div>
				<h2 className="font-semibold text-2xl">Summary</h2>
				<div className="flex gap-5 mt-2 max-w-full overflow-x-auto max-h-min">
					<Summary 
						color={"blue"}
                        value={summaryData.sales}
                        label={"Total sales"}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>}
					/>
					<Summary 
						color={"green"}
                        value={summaryData.shipments}
                        label={"Number of shipments"}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>}z
					/>
					<Summary 
						color={"yellow"}
                        value={summaryData.products}
                        label={"Number of products"}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
                            </svg>}
					/>
					<Summary 
						color={"red"}
                        value={summaryData.employees}
                        label={"Number of employees"}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                            </svg>}
					/>
					<Summary 
						color={"lime"}
                        value={summaryData.customers}
                        label={"Number of customers"}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>}
                    />
				</div>
			</div>
			<div className="mt-4">
                <h2 className="font-semibold text-2xl">Analytics</h2>
                <Chart
                    type="line"
                    data={chartData}
                    options={chartOptions}
                    className="w-full"
                />
			</div>
		</div>
    )
};

export default Dashboard;
