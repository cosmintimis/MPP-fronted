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
} from "@/components/ui/dropdown-menu";
import {  useState } from "react";
import { displayAlert } from "@/components/ui/custom-alert";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default function MasterPage() {

    const { birthsPerYear, size, limit, setSearchByUsername, setSortedByUsername, setSkip, setLimit, startBirthDate, endBirthDate, setStartBirthDate, setEndBirthDate, users, selectedUserId, deleteProduct } = useUserStore();
    const [currentPage, setCurrentPage] = useState(0);

    function handleSearchByUsername() {
        const input = document.getElementById("myInput") as HTMLInputElement;
        const currentUsername = input.value;
        setSearchByUsername(currentUsername);
    }

    function handlePreviousPage() {
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

    function handleNextPage() {
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

    const handleDeleteProduct = async (productId: number) => {
        const alertContainer = document.getElementById("alert-container");
        try {
            await deleteProduct(productId);
            if (alertContainer)
                displayAlert(alertContainer, "success", "Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
      };
    
    function populateProductsTable() {
        if(selectedUserId === -1)
            return;

        const userIndex = users.findIndex((user) => user.id === selectedUserId);

        if(userIndex === -1)
            return;
    
        return users[userIndex].products.map((product) => (
            <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price.toFixed(2)}</TableCell>
                <TableCell>
                    <Link to={`/addEditProduct/${product.id}`} className={buttonVariants({ variant: "default" })}>Edit</Link>
                </TableCell>
                <TableCell>
                    <Button onClick={() => handleDeleteProduct(product.id)}  variant={"destructive"}>Delete</Button>
                </TableCell>
                
                
            </TableRow>
        ))
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
                        <Input data-testid="search-test" id="myInput" type="text" placeholder="Search user..." onChange={handleSearchByUsername} />
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
                    <div className="mx-4 flex justify-around">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[200px] justify-start text-left font-normal mr-2",
                                            !startBirthDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startBirthDate ? format(startBirthDate, "PPP") : <span>Pick a start birth date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startBirthDate}
                                        onSelect={(date) => {
                                            if(date)
                                                setStartBirthDate(date);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[200px] justify-start text-left font-normal",
                                            !endBirthDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endBirthDate ? format(endBirthDate, "PPP") : <span>Pick an end birth date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endBirthDate}
                                        onSelect={(date) => {
                                            if(date)
                                                setEndBirthDate(date);
                                               
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                       </div>
                    <Button data-testid="next-btn" onClick={handleNextPage} className="mr-10" variant={"pagination"}>Next Page</Button>
                </div>
                <div className="relative w-full flex item-center justify justify-around mt-20">
                <div className="w-[500px] text-white z-10 max-h-[300px] overflow-scroll">
                    <Table>
                        <TableCaption>Products of selected user.</TableCaption>
                        <TableCaption className="mb-10">
                            <Link to={'/addEditProduct'} className={buttonVariants({ variant: "adding" })}>Add Product</Link>
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {
                            populateProductsTable()
                        }
                        </TableBody>
                    </Table>
                </div>
                <div data-testid="bar-chart-test-id" className="h-[300px] w-[500px] mt-8 z-10">
                    <BarChart chartData={userDataBarChart} chartOptions={chartOptions} />
                </div>
                </div>
                <div className="absolute top-0 h-[75px] hidden justify-center items-center w-full z-10" id="alert-container" data-testid="alert-container-test"></div>
            </div>
        </>
    );
}