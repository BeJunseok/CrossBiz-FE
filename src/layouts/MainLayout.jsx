import { Outlet } from 'react-router-dom';


export default function MainLayout() {
  return (
    <div className="min-h-[100dvh] w-screen bg-black flex justify-center">
      <main className="w-full max-w-[393px] bg-[#f3f3f3]">
        <Outlet />
      </main>
    </div>
  );
}
