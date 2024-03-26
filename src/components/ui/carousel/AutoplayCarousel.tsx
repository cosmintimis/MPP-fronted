import "./AutoplayCarousel.scss";
import { USERS, User} from "@/constants/user";
import CarouselItem from "./CarouselItem";
import { useEffect, useState } from "react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BarChart from "@/components/ui/bar-chart";
import { ChartData, ChartOptions } from "chart.js";
import 'chart.js/auto';
import { displayAlert } from "../custom-alert";
// import { Chart, ArcElement} from "chart.js/auto"
// Chart.register(ArcElement);

export default function AutoplayCarousel() {
    const usersPerPage = 4;
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        displayCurrentPage();
        clearSearch();
    }, [currentPage]);

    function clearSearch() {
        const input = document.getElementById("myInput") as HTMLInputElement;
        input.value = "";
    }

    async function deleteUser(userId: number) {
        const indexCurrentPage = users.findIndex((user) => user.userId === userId);
        if (indexCurrentPage === -1) {
            return;
        }
        const indexAllUsers = USERS.findIndex((user) => user.userId === userId);
        USERS.splice(indexAllUsers, 1);

        if(users.length === 1 && currentPage > 1)
            setCurrentPage(currentPage - 1);
        displayCurrentPage();
    }

    function handleSearch() {
        const input = document.getElementById("myInput") as HTMLInputElement;
        const currentUsername = input.value;

        const filteredUsers = USERS.slice(currentPage - 1, usersPerPage).filter(user => user.username.toLowerCase().includes(currentUsername.toLowerCase()));
        setUsers(filteredUsers);
    }

    function displayCurrentPage() {
        const indexOfFirstUser = (currentPage - 1) * usersPerPage;
        const indexOfLastUser = indexOfFirstUser + usersPerPage;
        const currentUsers = USERS.slice(indexOfFirstUser, indexOfLastUser);
        setUsers(currentUsers);
    }

    function handleNextPage() {
        const alertContainer = document.getElementById("alert-container");
        if (currentPage >= Math.ceil(USERS.length / usersPerPage))
        {
            if(alertContainer)
                displayAlert(alertContainer, "warning", "There are no more pages!");
            return;
        }

        setCurrentPage(currentPage + 1);

    }

    function handlePreviousPage() {
        const alertContainer = document.getElementById("alert-container");
        if (currentPage === 1)
        {
            if(alertContainer)
                displayAlert(alertContainer, "warning", "There are no more pages!");
            return;
        }
        setCurrentPage(currentPage - 1);
    }


    function getNumberOfBirthsPerYear(): number[] {

        const allYears = [...new Set(USERS.sort((a, b) => a.birthdate.getFullYear() - b.birthdate.getFullYear()).map(user => user.birthdate.getFullYear()))];
        const birthsPerYear = allYears.map(year => USERS.filter(user => user.birthdate.getFullYear() === year).length);
        return birthsPerYear;
    }

    const userDataBarChart: ChartData<"bar"> = {
        labels: [...new Set(USERS.sort((a, b) => a.birthdate.getFullYear() - b.birthdate.getFullYear()).map(user => user.birthdate.getFullYear()))],
        datasets: [
            {
                label: 'Number of Births per Year',
                data: getNumberOfBirthsPerYear(),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
            }

        ]
    };



    const chartOptions: ChartOptions<"bar"> = {
        maintainAspectRatio: false, responsive: true, plugins: {
            legend: {
                display: true,
                position: "bottom"
            },
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 0.5,
                    color: 'white'
                },
            },
            x: {
                ticks: {
                    color: 'white'
                },
            },

        },
        color: 'white'
    };

    return (
        <>
            <div className="carousel-container">
                <div className="carousel-track">
                    {users.map(user => (
                        <CarouselItem
                            key={user.userId}
                            username={user.username}
                            avatar={user.avatar}
                            userId={user.userId}
                            birthdate={user.birthdate}
                            deleteAction={deleteUser}
                        ></CarouselItem>
                    )
                    )
                    }
                    {users.map(user => (
                        <CarouselItem
                            key={user.userId}
                            username={user.username}
                            avatar={user.avatar}
                            userId={user.userId}
                            birthdate={user.birthdate}
                            deleteAction={deleteUser}
                        ></CarouselItem>
                    )
                    )
                    }
                </div>
            </div>
            <div className="flex relative items-center justify-center w-full mt-4 h-[10%]">
                <p className="text-white pr-10">Count: {users.length}</p>
                <p data-testid="page-number" className="text-white pr-10">Page: {currentPage}</p>
                <Link to={'/addUser'} data-testid="add-new-user-page" className={buttonVariants({ variant: "adding" })}>Add User</Link>
            </div>
            <div className="flex relative justify-between w-full mt-4 h-[10%]">
                <Button data-testid="prev-btn" onClick={handlePreviousPage} className="ml-10" variant={"pagination"}>Previous Page</Button>
                <Input data-testid="search-test" id="myInput" type="text" placeholder="Search" className="w-1/6" onChange={() => { handleSearch() }} />
                <Button data-testid="next-btn" onClick={handleNextPage} className="mr-10" variant={"pagination"}>Next Page</Button>
            </div>
            <div className="flex relative justify-center items-center w-full mt-[10px] h-[40%] max-h-[350px] min-h-[200px]">
                <div data-testid="bar-chart-test-id" className="h-[90%] w-1/2">
                    <BarChart chartData={userDataBarChart} chartOptions={chartOptions} />
                </div>
            </div>
            <div className="absolute top-0 h-[75px] flex justify-center items-center w-full" id="alert-container"></div>
            
        </>
    );
}
