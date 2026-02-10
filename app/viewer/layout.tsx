export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen relative bg-[#FBFBFB]">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-[url('/images/BlueBackground.png')] bg-[length:100%_50%] bg-no-repeat bg-top mt-[-64px]"></div>
      {children}
    </div>
  );
}
