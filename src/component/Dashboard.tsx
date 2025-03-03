import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '../assets/images/logo-devlinks-large.svg';
import MiniLogo from '../assets/images/logo-devlinks-small.svg';
import Link from '../assets/images/icon-links-header.svg';
import Preview from '../assets/images/icon-preview-header.svg';
import Profile from '../assets/images/icon-profile-details-header.svg';
import LinksPage from './LinksPage';
import ProfilePage from './ProfilePage';
import { useNavigate } from 'react-router-dom';
import MobilePreview from './MobilePreview';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('links');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <img src={Logo} alt="Devlinks" className="h-9 md:block hidden" />
            <img src={MiniLogo} alt="Devlinks" className="h-9 md:hidden block" />
          
            <Tabs defaultValue="links" className="flex-1 max-w-[150px] md:max-w-[300px] mx-auto pb-2">
              <TabsList className="grid w-full grid-cols-2 bg-white gap-4 ">
                <TabsTrigger value="links" className="group h-[40px] flex items-center gap-2 data-[state=active]:bg-[#8860E6]/10 data-[state=active]:text-[#8860E6] hover:text-[#8860E6]"
                  onClick={() => setActiveTab('links')}
                >
                  <img 
                    src={Link} 
                    className="h-5 w-5 md:h-4 md:w-4 group-data-[state=active]:[filter:invert(45%)_sepia(65%)_saturate(825%)_hue-rotate(217deg)_brightness(95%)_contrast(93%)]"
                  />
                  <span className="hidden md:inline">Links</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="group h-[40px] flex items-center gap-2 data-[state=active]:bg-[#8860E6]/10 data-[state=active]:text-[#8860E6] hover:text-[#8860E6]"
                  onClick={() => setActiveTab('profile')}
                >
                  <img 
                    src={Profile} 
                    className="h-5 w-5 md:h-4 md:w-4 group-data-[state=active]:[filter:invert(45%)_sepia(65%)_saturate(825%)_hue-rotate(217deg)_brightness(95%)_contrast(93%)]"
                  />
                  <span className="hidden md:inline">Profile Details</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
  
            <Button variant="outline" className="px-5 h-10 border-purple-500"
              onClick={() => navigate('/preview')}
            >
              <img src={Preview} 
              className='h-5 w-5 md:hidden'
              />
              <span className="hidden md:inline">Preview</span>
            </Button>
          </nav>
        </div>
      </header>

      <div className="lg:flex">
        <div className='flex w-[40%] justify-center sticky top-20 self-start'>
            <MobilePreview />
        </div>
        {
          activeTab === 'links' ? (
            <LinksPage />
            ) : (
              <ProfilePage />
            )
          }
        </div>
      </div>
  );
};

export default Dashboard;