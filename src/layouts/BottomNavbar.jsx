import { useNavigate, useLocation } from 'react-router-dom';
import Visa from '@/assets/svg/layout/visa.svg?react';
import VisaON from '@/assets/svg/layout/visa-active.svg?react';
import Analysis from '@/assets/svg/layout/analysis.svg?react';
import AnalysisON from '@/assets/svg/layout/analysis-active.svg?react';
import Tax from '@/assets/svg/layout/tax.svg?react';
import TaxON from '@/assets/svg/layout/tax-active.svg?react';
import Community from '@/assets/svg/layout/community.svg?react';
import CommunityON from '@/assets/svg/layout/community-active.svg?react';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'visa',
      label: '비자',
      path: '/',
      icon: Visa,
      activeIcon: VisaON,
    },
    {
      id: 'analysis',
      label: '상권리포트',
      path: '/analysis',
      icon: Analysis,
      activeIcon: AnalysisON,
    },

    {
      id: 'tax',
      label: '세무',
      path: '/tax',
      icon: Tax,
      activeIcon: TaxON,
    },
    {
      id: 'community',
      label: '커뮤니티',
      path: '/community',
      icon: Community,
      activeIcon: CommunityON,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const NavigationItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const IconComponent = isActive ? item.activeIcon : item.icon;

    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={`w-[70px] h-16 flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200  ${
          isActive
            ? 'bg-[#EBEAFF] transform scale-105 shadow-lg'
            : 'bg-[#f3f3f3] hover:bg-gray-200'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <IconComponent className="w-12 h-8" />
          <span className="mt-1 text-[10px] font-medium text-gray-600">
            {item.label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full bg-white rounded-t-3xl px-4 py-3 shadow-lg border-t border-gray-100">
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
