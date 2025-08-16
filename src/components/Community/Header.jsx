import User from '@/assets/icons/User.svg?react';
import Search from '@/assets/icons/Search.svg?react';

const Header = () => {
  return (
    <div className=" px-4 py-4 flex justify-between items-center mb-10">
      <h1 className="text-3xl font-bold text-black">커뮤니티</h1>
      <div className="flex gap-3">
        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
          <Search />
        </div>
        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
          <User />
        </div>
      </div>
    </div>
  );
};

export default Header;
