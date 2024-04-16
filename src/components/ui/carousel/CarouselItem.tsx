
import { useUserStore } from "@/store/users";
import { useNavigate } from "react-router-dom";

export default function CarouselItem({ userId, username, avatar, birthdate ,deleteAction}: { userId: number, username: string, avatar: string, birthdate: Date, deleteAction: Function }) {

  const { setSelectedUserId } = useUserStore();

  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await deleteAction(userId);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  function updateUser(userId: number) {
    navigate(`/update/${userId}`);
  }

 
  return (
    <div data-testid="carousel-card-test" className="carousel-card flex-col items-center justify-between">
      <div className="relative text-center mb-4 flex justify-between items-center w-full px-8 pt-4">

        <div className="flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => updateUser(userId)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-8 h-8 cursor-pointer hover:stroke-green-600 update-btn pt-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setSelectedUserId(userId)} className="w-8 h-8 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-150 duration-300 pt-2"><g id="SVGRepo_bgCarrier" ></g><g id="SVGRepo_tracerCarrier" ></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Show"> <g id="Vector"> <path d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z" stroke="#000000"></path> <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" stroke="#000000"></path> </g> </g> </g></svg>

        </div>
        <h2 className="text-white">{username}</h2>
        <svg xmlns="http://www.w3.org/2000/svg" onClick={handleDelete} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-8 h-8 hover:stroke-red-500 cursor-pointer delete-btn pt-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <img src={avatar} alt="avatarImage" className="rounded-full w-full pb-20" />
      <div className="text-white pb-10">{birthdate.toDateString()}</div>
    </div>

  );
}

