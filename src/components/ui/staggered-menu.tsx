import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

interface MenuItem {
  label: string;
  ariaLabel?: string;
  link?: string;
  onClick?: () => void;
}

interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  items: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  colors?: string[];
  logoUrl?: string;
  accentColor?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  items,
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = false,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = false,
  colors = ['#B19EEF', '#5227FF'],
  logoUrl,
  accentColor = '#ff6b6b',
  onMenuOpen,
  onMenuClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      onMenuOpen?.();
    } else {
      document.body.style.overflow = '';
      onMenuClose?.();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onMenuOpen, onMenuClose]);

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
      setIsOpen(false);
    } else if (item.link) {
      if (item.link.startsWith('#')) {
        // Scroll to element
        setIsOpen(false);
        setTimeout(() => {
          const element = document.querySelector(item.link!);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      } else {
        navigate(item.link);
        setIsOpen(false);
      }
    }
  };

  const getGradientDirection = () => {
    switch (position) {
      case 'left':
        return 'to right';
      case 'right':
        return 'to left';
      case 'top':
        return 'to bottom';
      case 'bottom':
        return 'to top';
      default:
        return 'to left';
    }
  };

  const containerVariants = {
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: position === 'right' ? 50 : position === 'left' ? -50 : 0,
      y: position === 'bottom' ? 50 : position === 'top' ? -50 : 0
    },
    open: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-[100] p-3 rounded-full bg-gradient-to-br from-purple-600/90 to-blue-600/90 backdrop-blur-md hover:from-purple-500 hover:to-blue-500 transition-all shadow-2xl border-2 border-white/30"
        style={{
          right: position === 'right' ? '20px' : 'auto',
          left: position === 'left' ? '20px' : 'auto',
          top: position === 'top' ? '20px' : position === 'bottom' ? 'auto' : '20px',
          bottom: position === 'bottom' ? '20px' : 'auto',
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X size={24} className="text-white drop-shadow-lg" />
        ) : (
          <Menu size={24} className="text-white drop-shadow-lg" />
        )}
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-0 z-[90] flex flex-col justify-center items-center`}
              style={{
                background: `linear-gradient(${getGradientDirection()}, ${colors[0]}, ${colors[1]})`
              }}
            >
              <motion.div
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="max-w-4xl w-full px-8"
              >
                {/* Logo */}
                {logoUrl && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-12 flex justify-center"
                  >
                    <img src={logoUrl} alt="Logo" className="h-16 w-auto" />
                  </motion.div>
                )}

                {/* Menu Items */}
                <div className="space-y-4 mb-16">
                  {items.map((item, index) => (
                    <motion.button
                      key={index}
                      variants={itemVariants}
                      onClick={() => handleItemClick(item)}
                      className="block w-full text-left group"
                      aria-label={item.ariaLabel || item.label}
                    >
                      <div className="flex items-center gap-4 text-white hover:text-white/80 transition-colors">
                        {displayItemNumbering && (
                          <span
                            className="text-4xl font-bold opacity-30 group-hover:opacity-60 transition-opacity"
                            style={{ color: accentColor }}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                        <span className="text-5xl md:text-7xl font-bold">
                          {item.label}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Social Items */}
                {displaySocials && socialItems.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="flex gap-6 justify-center"
                  >
                    {socialItems.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={itemVariants}
                        className="text-white/70 hover:text-white transition-colors text-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.label}
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StaggeredMenu;

