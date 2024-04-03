import { SparklesCore } from "@/components/ui/sparkles"
import AutoplayCarousel from "@/components/ui/carousel/AutoplayCarousel"


export default function MasterPage() {
    return (
      <>
      <div className="h-[100vh] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
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
        <div className="relative w-full h-full">
          <AutoplayCarousel />
        </div>
      </div>
      </>
    );
  }