import "./AutoplayCarousel.scss";
import CarouselItem from "./CarouselItem";
import { useEffect, useMemo, useState } from "react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BarChart from "@/components/ui/bar-chart";
import { ChartData, ChartOptions } from "chart.js";
import 'chart.js/auto';
import { displayAlert } from "../custom-alert";
// import { Chart, ArcElement} from "chart.js/auto"
// Chart.register(ArcElement);
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserStore } from "@/store/users";

export default function AutoplayCarousel() {
    const { deleteUser, users, changeFlag, flag } = useUserStore();
    const [usersPerPage, setUsersPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const localUsers = useMemo(() => {
        const startUsersPerPage = (currentPage - 1) * usersPerPage;
        const endUsersPerPage = currentPage * usersPerPage;
        const filteredUsers = users.slice(startUsersPerPage, endUsersPerPage).filter(user => user.username.toLowerCase().includes(searchValue.toLowerCase()));
        console.log(filteredUsers);
        return filteredUsers;
    }, [currentPage, usersPerPage, searchValue, users]);

    useEffect(() => {
        clearSearch();
    }, [currentPage, usersPerPage]);

    function handleSort() {
        changeFlag(flag.valueOf() == "false" ? "true" : "false");
    }

    function clearSearch() {
        const input = document.getElementById("myInput") as HTMLInputElement;
        input.value = "";
    }

    function handleSearch() {
        const input = document.getElementById("myInput") as HTMLInputElement;
        const currentUsername = input.value;
        setSearchValue(currentUsername);
    }


    function handleNextPage() {
        const alertContainer = document.getElementById("alert-container");
        if (currentPage >= Math.ceil(users.length / usersPerPage)) {
            if (alertContainer)
                displayAlert(alertContainer, "warning", "There are no more pages!");
            return;
        }

        setCurrentPage(currentPage + 1);

    }

    function handlePreviousPage() {
        const alertContainer = document.getElementById("alert-container");
        if (currentPage === 1) {
            if (alertContainer)
                displayAlert(alertContainer, "warning", "There are no more pages!");
            return;
        }
        setCurrentPage(currentPage - 1);
    }

 


    function getNumberOfBirthsPerYear(): number[] {

        const allYears = [...new Set(users.sort((a, b) => a.birthdate.getFullYear() - b.birthdate.getFullYear()).map(user => user.birthdate.getFullYear()))];
        const birthsPerYear = allYears.map(year => users.filter(user => user.birthdate.getFullYear() === year).length);
        return birthsPerYear;
    }

    const userDataBarChart: ChartData<"bar"> = {
        labels: [...new Set(users.sort((a, b) => a.birthdate.getFullYear() - b.birthdate.getFullYear()).map(user => user.birthdate.getFullYear()))],
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

    var numbersPerPageToBeSelected = [];
    for (let i = 5; i <= users.length; i += 5) {
        numbersPerPageToBeSelected.push(i);
    }

    return (
        <>
            <div className="carousel-container">
                <div className="carousel-track">
                    {localUsers.map(user => (
                        <CarouselItem
                            key={user.id}
                            username={user.username}
                            avatar={user.avatar}
                            userId={user.id}
                            birthdate={user.birthdate}
                            deleteAction={deleteUser}
                        ></CarouselItem>
                    )
                    )
                    }
                </div>
            </div>
            <div className="flex relative items-center justify-center w-full mt-4 h-[10%]">
                <p className="text-white pr-10">Count: {localUsers.length}</p>
                <p data-testid="page-number" className="text-white pr-10">Page: {currentPage}</p>
                <Link to={'/addUser'} data-testid="add-new-user-page" className={buttonVariants({ variant: "adding" })}>Add User</Link>
            </div>
            <div className="flex relative justify-between w-full mt-4 h-[10%]">
                <Button data-testid="prev-btn" onClick={handlePreviousPage} className="ml-10" variant={"pagination"}>Previous Page</Button>
                <Input data-testid="search-test" id="myInput" type="text" placeholder="Search" className="w-1/6" onChange={() => { handleSearch() }} />
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button data-testid="dropdown-btn-test-id" variant="outline">Users per Page</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent data-testid="dropdown-menu-content-test-id" className="w-56">
                        <DropdownMenuLabel>Select desired number</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup>
                            {
                                numbersPerPageToBeSelected.map((numberPerPage) => (
                                    <DropdownMenuRadioItem key={numberPerPage} data-testid="dropdown-item-test-id" value={numberPerPage.toString()} onClick={() => { setUsersPerPage(numberPerPage) }}>
                                        {numberPerPage}
                                    </DropdownMenuRadioItem>
                                ))
                            }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button data-testid="sort-btn" onClick={handleSort} className="mr-10" variant={"pagination"}>Sort by username</Button>
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
