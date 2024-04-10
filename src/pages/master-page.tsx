import { SparklesCore } from "@/components/ui/sparkles"
import AutoplayCarousel from "@/components/ui/carousel/AutoplayCarousel"
import { useUserStore } from "@/store/users";
import BarChart from "@/components/ui/bar-chart";
import { ChartData, ChartOptions } from "chart.js";
import 'chart.js/auto';
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {  useState } from "react";
import { displayAlert } from "@/components/ui/custom-alert";

export default function MasterPage() {

    const { birthsPerYear, size, limit, setSearchByUsername, setSortedByUsername, setSkip, setLimit } = useUserStore();
    const [currentPage, setCurrentPage] = useState(0);
   

    function handleSearchByUsername(){
        const input = document.getElementById("myInput") as HTMLInputElement;
        const currentUsername = input.value;
        setSearchByUsername(currentUsername);
    }

    function handlePreviousPage(){
        const page = currentPage - 1;
        const alertContainer = document.getElementById("alert-container");
        if (page < 0) {
            if (alertContainer)
                displayAlert(alertContainer, "warning", "There are no more pages!");
            return;
        }
        setCurrentPage(page);
        setSkip(page * limit);
    }

    function handleNextPage(){
        const page = currentPage + 1;
        const alertContainer = document.getElementById("alert-container");
        if (page >= Math.ceil(size / limit)) {
            if (alertContainer)
                displayAlert(alertContainer, "warning", "There are no more pages!");
            return;
        }

        setCurrentPage(page);
        setSkip(page * limit);
    }


 
    const userDataBarChart: ChartData<"bar"> = {
        labels: Object.keys(birthsPerYear),
        datasets: [
            {
                label: 'Number of Births per Year',
                data: Object.values(birthsPerYear),
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

    var numbersPerPageToBeSelected = [5];
    for (let i = 10; i <= size; i += 5) {
        numbersPerPageToBeSelected.push(i);
    }
    return (
    <>
        <div className="h-[100vh] relative w-full bg-black flex flex-col items-center justify-start overflow-hidden rounded-md">
            <div className="w-full absolute inset-0 h-screen z-0">
            <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={50}
                className="w-full h-full"
                particleColor="#FFFFFF"
            />
            </div>
            <div className="relative w-full h-[350px] z-10">
            <AutoplayCarousel />
            </div>
            <div className="flex w-full mt-8 justify-center z-10">
            <Link to={'/addUser'} data-testid="add-new-user-page" className={buttonVariants({ variant: "adding" })}>Add User</Link>
            </div>
            <div className="flex w-full mt-8 justify-between z-10">
            <Button data-testid="prev-btn" onClick={handlePreviousPage} className="ml-10" variant={"pagination"}>Previous Page</Button>
            <div className="flex justify-center">
            <p className="text-white pr-6">Count:{limit}</p>
            <Button data-testid="sort-btn" onClick={() => setSortedByUsername("ascending")} className="mr-2" variant={"pagination"}>Sort by username</Button>
            <Input data-testid="search-test" id="myInput" type="text" placeholder="Search user..."  onChange={handleSearchByUsername} />
            <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button data-testid="dropdown-btn-test-id" variant="outline" className="ml-2">Users per Page</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent data-testid="dropdown-menu-content-test-id">
                            <DropdownMenuLabel>Select desired number</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup>
                                {
                                    numbersPerPageToBeSelected.map((numberPerPage) => (
                                        <DropdownMenuRadioItem key={numberPerPage} data-testid="dropdown-item-test-id" value={numberPerPage.toString()} onClick={() => { setLimit(numberPerPage) }}>
                                            {numberPerPage}
                                        </DropdownMenuRadioItem>
                                    ))
                                }
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
            </div>
            <Button data-testid="next-btn" onClick={handleNextPage} className="mr-10" variant={"pagination"}>Next Page</Button>
            </div>
            <div data-testid="bar-chart-test-id" className="h-[200px] w-[300px] mt-8 z-10">
                        <BarChart chartData={userDataBarChart} chartOptions={chartOptions} />
            </div>
            <div className="absolute top-0 h-[75px] hidden justify-center items-center w-full z-10" id="alert-container" data-testid="alert-container-test"></div>
        </div>
    </>
    );
  }