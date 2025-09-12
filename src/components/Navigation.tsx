"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Menu, X, Zap, Phone, Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes";
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to determine if we're on the main page
  const isOnMainPage = location.pathname === '/';
  
  const navItems = [
    { name: t('nav.home'), href: isOnMainPage ? '#home' : '/#home', isRoute: !isOnMainPage },
    { name: t('nav.services'), href: isOnMainPage ? '#services' : '/#services', isRoute: !isOnMainPage },
    { name: t('nav.products'), href: isOnMainPage ? '#products' : '/#products', isRoute: !isOnMainPage },
    { name: t('nav.about'), href: '/about', isRoute: true },
    { name: t('nav.contact'), href: isOnMainPage ? '#contact' : '/#contact', isRoute: !isOnMainPage }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-sm shadow-md border-b border-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary shadow-sm">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-xl text-primary">
                RAKESH
              </h1>
              <p className="text-xs text-text-muted font-roboto">ELECTRONICS</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium font-poppins"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium font-poppins"
                  >
                    {item.name}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* CTA Button & Toggles */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="green" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              {t('buttons.bookRepair')}
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 card-clean mt-2 rounded-lg">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-text-secondary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-text-secondary hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <div className="pt-2">
                <Button variant="green" size="sm" className="w-full">
                  <Phone className="h-4 w-4" />
                  Book Repair
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Navigation;