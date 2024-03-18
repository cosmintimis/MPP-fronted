import "./AutoplayCarousel.scss";
import { USERS, USERS as initialUsers } from "./carousel-config";
import CarouselItem from "./CarouselItem";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";


export default function AutoplayCarousel() {
    const [users, setUsers] = useState(initialUsers);
    
    // useEffect(() => {
    //     setUsers(initialUsers);
    // }, [initialUsers]);

    async function deleteUser(userId: string) {
        const index = users.findIndex((user) => user.userId === userId);
        if (index === -1) {
            return;
        }
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        USERS.splice(index, 1);
        setUsers(updatedUsers);
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
                            deleteAction={deleteUser}
                        ></CarouselItem>
                    )
                    )
                    }
                </div>
            </div>
            <div className="flex absolute bottom-10 items-center justify-center w-full mt-50 max-h-[50px]">
                <Link to={'/addUser'} data-testid="add-new-user-page" className={buttonVariants({ variant: "adding" })}>Add User</Link>
            </div>
        </>
    );
}
