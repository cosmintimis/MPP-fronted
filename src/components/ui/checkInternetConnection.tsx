import { Detector } from "react-detect-offline";


const CheckInternetConnection = (props: any) =>{
  return (
    <>
      <Detector
        render={({ online }) =>
          online ? (
            props.children
          ) : (
            <div className="flex w-full h-[100vh] text-white bg-black justify-center items-center">
              You are offline. Please check your internet connection.
            </div>
          )
        }
      />
    </>
  );
}

export default CheckInternetConnection;
