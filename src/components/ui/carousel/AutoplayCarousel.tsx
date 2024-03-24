import "./AutoplayCarousel.scss";
import { USERS, USERS as initialUsers } from "@/constants/user";
import CarouselItem from "./CarouselItem";
import { useEffect, useState } from "react";
import { buttonVariants, Button} from "@/components/ui/button";
import { Link } from "react-router-dom";
import {Input} from "@/components/ui/input";


export default function AutoplayCarousel() {
    const usersPerPage = 4;
    const [users, setUsers] = useState(initialUsers.slice(0, usersPerPage));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        displayCurrentPage();
        clearSearch();
    }, [currentPage]);

    

    function clearSearch(){
        const input = document.getElementById("myInput") as HTMLInputElement;
        input.value = "";  
    }

    async function deleteUser(userId: number) {
        const index = users.findIndex((user) => user.userId === userId);
        if (index === -1) {
            return;
        }
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        USERS.splice(index, 1);
        displayCurrentPage();
    }

    function handleSearch(){
        const input = document.getElementById("myInput") as HTMLInputElement;
        const currentUsername = input.value;

        const filteredUsers = USERS.slice(currentPage - 1, usersPerPage).filter(user => user.username.toLowerCase().includes(currentUsername.toLowerCase()));
        setUsers(filteredUsers);
    }

    function displayCurrentPage(){
        const indexOfFirstUser = (currentPage - 1) * usersPerPage;
        const indexOfLastUser = indexOfFirstUser + usersPerPage;
        const currentUsers = USERS.slice(indexOfFirstUser, indexOfLastUser);
        setUsers(currentUsers);
    }

    function handleNextPage(){
        if(currentPage === Math.ceil(initialUsers.length / usersPerPage))
            return;
        setCurrentPage(currentPage + 1);
       
    }

    function handlePreviousPage(){
        if(currentPage === 1)
            return;
        setCurrentPage(currentPage - 1);
    }

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
            <div className="flex relative items-center justify-center w-full mt-4">
                <p className="text-white pr-10">Count: {users.length}</p>
                <p className="text-white pr-10">Page: {currentPage}</p>
                <Link to={'/addUser'} data-testid="add-new-user-page" className={buttonVariants({ variant: "adding" })}>Add User</Link>    
            </div>
            <div  className="flex relative justify-between w-full mt-4">
                <Button onClick={handlePreviousPage} className="ml-10" variant={"pagination"}>Previous Page</Button>
                <Input data-testid="search-test" id="myInput" type="text" placeholder="Search" className="w-1/6" onChange={ () => {handleSearch()}} />
                <Button onClick={handleNextPage} className="mr-10" variant={"pagination"}>Next Page</Button>
            </div>
        </>
    );
}
