import RightPannel from "@/components/RightPannel/RightPannel";
import ThreeViewer from "@/components/ThreeViewer";

export default function ViewerPage() {
  return (
    <div className="flex w-screen h-screen">
      <div className="flex-1">
        <ThreeViewer />
        <RightPannel />
      </div>
    </div>
  );
}
