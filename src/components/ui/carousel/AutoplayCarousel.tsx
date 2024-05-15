import "./AutoplayCarousel.scss";
import CarouselItem from "./CarouselItem";
import { useUserStore } from "@/store/users";
import { getCurrentUser } from "@/api/auth";

export default function AutoplayCarousel() {
    const { deleteUser, users } = useUserStore();
    const currentUser = getCurrentUser();
    return (
        <>
            <div className="carousel-container">
                <div className="carousel-track">
                    {users.map(user => (
                        <CarouselItem
                            key={user.id}
                            username={user.username}
                            avatar={user.avatar}
                            userId={user.id}
                            birthdate={user.birthdate}
                            roles={currentUser!.roles}
                            deleteAction={deleteUser}
                        ></CarouselItem>
                    ))
                    }
                </div>
            </div>
        </>
    );
}
