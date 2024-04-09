import "./AutoplayCarousel.scss";
import CarouselItem from "./CarouselItem";
import { useUserStore } from "@/store/users";

export default function AutoplayCarousel() {
    const { deleteUser, users } = useUserStore();
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
                            deleteAction={deleteUser}
                        ></CarouselItem>
                    ))
                    }
                </div>
            </div>
        </>
    );
}
