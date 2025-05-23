'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tent, Menu, X, ChevronDown, UserRound, Loader2 } from "lucide-react";
import { useState } from 'react';
import { Button } from '../ui/button';
import styles from './user.header.module.css';
import LanguageSwitcher from '@/components/layouts/language.switcher';
import { useTranslations } from 'next-intl';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

export default function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const locale = pathname.split('/')[1] || 'en';
  const t = useTranslations('Header');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => {
    if (path === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname === path || pathname === `${path}/`;
  };

  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <li>
          <div className="flex items-center gap-2 px-3 py-2">
            <Loader2 className="h-5 w-5 animate-spin text-campfire" />
          </div>
        </li>
      );
    }

    if (isAuthenticated) {
      return (
        <li className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-opacity-80 px-3 py-2 rounded font-montserrat font-medium">
                <UserRound/>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-montserrat">
              { user?.role === 'super_admin' && (
                <DropdownMenuItem>
                  <Link href="/admin" className="w-full">
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Link href="/blogs/create" className="w-full">
                  Create Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer"
                aria-label="Logout"
                aria-busy={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Logging out...</span>
                  </div>
                ) : (
                  'Logout'
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      );
    }

    return (
      <li>
        <Link href={`/${locale}/auth`}>
          <Button className={`${styles.loginButton} bg-campfire font-montserrat font-medium`}>
            {t('login')}
          </Button>
        </Link>
      </li>
    );
  };

  return (
    <header className="bg-forest text-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex justify-between w-full md:w-auto items-center">
            <Link href={`/${locale}`} className="flex items-center">
              <span className="text-3xl font-bold font-montserrat tracking-wider">FanCamping</span>
              <Tent className="ml-2 text-campfire h-6 w-6" />
            </Link>
            <button
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-auto mt-4 md:mt-0`}>
            <ul className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <li>
                <Link
                  href={`/${locale}`}
                  className={`${styles.navLink} block px-3 py-2 rounded font-montserrat font-medium ${isActive(`/${locale}`) ? styles.active : ''}`}
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/rentals`}
                  className={`${styles.navLink} block px-3 py-2 rounded font-montserrat font-medium ${isActive(`/${locale}/rentals`) ? styles.active : ''}`}
                >
                  {t('rentals')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blogs`}
                  className={`${styles.navLink} block px-3 py-2 rounded font-montserrat font-medium ${isActive(`/${locale}/blogs`) ? styles.active : ''}`}
                >
                  {t('blogs')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/articles`}
                  className={`${styles.navLink} block px-3 py-2 rounded font-montserrat font-medium ${isActive(`/${locale}/articles`) ? styles.active : ''}`}
                >
                  {t('articles')}
                </Link>
              </li>
              <LanguageSwitcher currentLocale={locale} />
              {renderAuthSection()}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}