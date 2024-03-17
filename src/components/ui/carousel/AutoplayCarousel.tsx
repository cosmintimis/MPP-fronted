import "./AutoplayCarousel.scss";
import { USERS, USERS as initialUsers } from "./carousel-config";
import CarouselItem from "./CarouselItem";
import { useState, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button"
import {Link} from "react-router-dom";


export default function AutoplayCarousel() {
    const [users, setUsers] = useState(initialUsers);
    const userCount = users.length;
    
    const getDuplicateUsers = () => {
        const additionalUsers = [...users];
        const duplicatesNeeded = Math.max(0, 5 - userCount);
        for (let i = 0; i < duplicatesNeeded; i++) {
            additionalUsers.push(...users);
        }
        return additionalUsers;
    };

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

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
    let duplicateUsers = getDuplicateUsers();
    return (
        <>
            <div className="carousel-container">
                <div className="carousel-track">
                    {Object.keys(duplicateUsers).map((user, index) => {
                        return (
                            <CarouselItem
                                key={user}
                                username={duplicateUsers[index].username}
                                avatar={duplicateUsers[index].avatar}
                                userId={duplicateUsers[index].userId}
                                deleteAction={deleteUser}
                                updateAction={deleteUser}
                            ></CarouselItem>
                        );
                    })}
                    {Object.keys(USERS).map((user, index) => {
                        return (
                            <CarouselItem
                                key={user}
                                username={duplicateUsers[index].username}
                                avatar={duplicateUsers[index].avatar}
                                userId={duplicateUsers[index].userId}
                                deleteAction={deleteUser}
                                updateAction={deleteUser}
                            ></CarouselItem>
                        );
                    })}
                </div>
            </div>
            <div className="flex absolute bottom-10 items-center justify-center w-full mt-50 max-h-[50px]">
                <Link to={'test'} className={buttonVariants({ variant: "adding" })}>Add User</Link>
            </div>
        </>
    );
}

export { AutoplayCarousel };