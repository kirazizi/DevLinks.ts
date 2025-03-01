import React from 'react';
import MobilePreviewImage from "../assets/images/illustration-phone-mockup.svg";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import GithubImage from '../assets/images/icon-github.svg';
import YoutubeImage from '../assets/images/icon-youtube.svg';
import LinkedinImage from '../assets/images/icon-linkedin.svg';
import FacebookImage from '../assets/images/icon-facebook.svg';
import TwitterImage from '../assets/images/icon-twitter.svg';
import DevtoImage from '../assets/images/icon-devto.svg';
import CodewarsImage from '../assets/images/icon-codewars.svg';
import FreecodecampImage from '../assets/images/icon-freecodecamp.svg';
import GitlabImage from '../assets/images/icon-gitlab.svg';
import HashnodeImage from '../assets/images/icon-hashnode.svg';
import StackoverflowImage from '../assets/images/icon-stack-overflow.svg';
import TwitchImage from '../assets/images/icon-twitch.svg';
import FrontendMentorImage from '../assets/images/icon-frontend-mentor.svg';

const platforms: Record<string, { name: string; color: string; icon: string }> = {
  github: { name: 'GitHub', color: "#1A1A1A", icon: GithubImage },
  youtube: { name: 'YouTube', color: "#EE3939", icon: YoutubeImage },
  linkedin: { name: 'LinkedIn', color: "#2D68FF", icon: LinkedinImage },
  facebook: { name: 'Facebook', color: "#2442AC", icon: FacebookImage },
  twitter: { name: 'Twitter', color: "#43B7E9", icon: TwitterImage },
  devto: { name: 'Dev.to', color: "#333333", icon: DevtoImage },
  codewars: { name: 'Codewars', color: "#8A1A50", icon: CodewarsImage },
  freecodecamp: { name: 'freeCodeCamp', color: "#302267", icon: FreecodecampImage },
  gitlab: { name: 'GitLab', color: "#EB4925", icon: GitlabImage },
  hashnode: { name: 'Hashnode', color: "#0330D1", icon: HashnodeImage },
  stackoverflow: { name: 'Stack Overflow', color: "#EC7100", icon: StackoverflowImage },
  twitch: { name: 'Twitch', color: "#EE3FC8", icon: TwitchImage },
  frontendmentor: { name: 'Frontend Mentor', color: "#FFFFFF", icon: FrontendMentorImage },
};

const MobilePreview = () => {
  const { links, profile } = useAuth()
  
  return (
    <div className="relative w-[308px] hidden lg:block">
      <img src={MobilePreviewImage} alt="Mobile Preview" className="w-full" />

      <div className="absolute top-[65px] left-0 right-0 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          {profile?.image && (
            <img 
              src={profile.image} 
              className="w-full h-full object-cover" 
              alt="Profile" 
            />
          )}
        </div>

        {(profile?.first_name || profile?.last_name) && (
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-full px-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              {`${profile.first_name || ""} ${profile.last_name || ""}`.trim()}
            </h2>
          </div>
        )}

        {profile?.email && (
          <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-full px-4 text-center">
            <p className="text-sm text-gray-600 font-medium bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              {profile.email}
            </p>
          </div>
        )}
      </div>

      <div className="absolute top-[279px] left-[35px] right-[35px] space-y-5 overflow-y-auto h-[300px] custom-scrollbar">
      {links?.map((link) => {
          const platform = platforms[link.platform] || platforms.github;
          const isFrontendMentor = link.platform === "frontendmentor";
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`h-11 rounded-lg flex items-center px-4 hover:opacity-90 transition-opacity border border-gray-300 dark:border-gray-600 shadow-sm ${
                isFrontendMentor ? "bg-white text-black" : "text-white"
              }`}
              style={{ backgroundColor: platform.color }}
            >
              <img 
                src={platform.icon} 
                alt={platform.name} 
                className={`h-5 w-5 ${isFrontendMentor ? "" : "filter brightness-0 invert"}`} 
                style={isFrontendMentor ? {} : { filter: "brightness(0) invert(1)" }}
              />
              <span className="ml-2 flex-grow text-sm font-medium">
                {platform.name}
              </span>
              <ChevronRight className={`h-4 w-4 ${isFrontendMentor ? "text-black" : "text-white"}`} />
            </a>
          );
        })}
      </div>
      <style>{`
          .custom-scrollbar::-webkit-scrollbar {
          width: 0; /* Remove scrollbar space */
          background: transparent; /* Optional: just to be sure */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent; /* Remove scrollbar thumb */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; /* Remove scrollbar track */
        }
      `}</style>
    </div>
  )
}


export default MobilePreview;