import { useNavigate } from "react-router-dom";

export default function CarouselItem({ userId, username, avatar, birthdate ,deleteAction }: { userId: number, username: string, avatar: string, birthdate: Date, deleteAction: Function }) {
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
      <div className="text-center mb-4 flex justify-between items-center w-full px-8 pt-4">

        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => updateUser(userId)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-8 h-8 cursor-pointer hover:stroke-green-600 update-btn pt-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>

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

