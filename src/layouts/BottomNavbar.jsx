import { useNavigate, useLocation } from 'react-router-dom';
import Visa from '@/assets/svg/layout/visa.svg?react';
import VisaON from '@/assets/svg/layout/visa-active.svg?react';
import Analytics from '@/assets/svg/layout/analytics.svg?react';
import AnalyticsON from '@/assets/svg/layout/analytics-active.svg?react';
import Calendar from '@/assets/svg/layout/calendar.svg?react';
import CalendarON from '@/assets/svg/layout/calendar-active.svg?react';
import Community from '@/assets/svg/layout/community.svg?react';
import CommunityON from '@/assets/svg/layout/community-active.svg?react';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'visa',
      path: '/visa',
      icon: Visa,
      activeIcon: VisaON,
    },
    {
      id: 'analytics',
      path: '/analytics',
      icon: Analytics,
      activeIcon: AnalyticsON,
    },

    {
      id: 'calendar',
      path: '/calendar',
      icon: Calendar,
      activeIcon: CalendarON,
    },
    {
      id: 'community',
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
        className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 bg-[#f3f3f3] ${
          isActive
            ? 'transform scale-105 shadow-lg'
            : 'hover:bg-gray-200'
        }`}
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <IconComponent className="w-8 h-8" />
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
