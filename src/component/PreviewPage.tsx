import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
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

export default function MobilePreview() {
  const { profile, links } = useAuth();

  const HandleShare = () => {
    const shareableLink = `${import.meta.env.VITE_BASE_LINK}${profile.id}`;
    navigator.clipboard.writeText(shareableLink);
    toast("The link has been copied to your clipboard!");
  };

  return (
    <div className="w-full mx-auto relative bg-white min-h-screen">
      <Toaster position="bottom-center" className="" />
      <div className="absolute top-0 left-0 right-0 h-[357px] bg-[#633CFF] rounded-b-[32px]" />
      <div className="relative">
        <div className="mx-4 pt-4">
          <div className="bg-white rounded-xl p-4 flex justify-between items-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="text-[#633CFF] border-[#633CFF] hover:bg-[#633CFF]/10 rounded-lg h-10 px-4 py-2"
            >
              Back to Editor
            </Button>
            <Button
              onClick={HandleShare}
              className="bg-[#633CFF] text-white hover:bg-[#633CFF]/90 rounded-lg h-10 px-4 py-2"
            >
              Share Link
            </Button>
          </div>
        </div>

        <div className="mt-[120px] px-4 w-[300px] align-center mx-auto">
          <div className="bg-white rounded-[24px] shadow-lg p-6 space-y-2">
            <div className="flex justify-center">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-[104px] h-[104px] rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-[104px] h-[104px] rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-[30px] font-bold text-[#333333]">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-[#737373]">{profile.email}</p>
            </div>

            <div className="space-y-4">
              {links.map((link, index) => {
                const platformKey = link.platform.toLowerCase();
                const platform = platforms[platformKey] || platforms.github;
                const isFrontendMentor = platformKey === "frontendmentor";

                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                      isFrontendMentor
                        ? "bg-white text-black border border-gray-300 shadow-sm"
                        : "text-white"
                    }`}
                    style={{
                      backgroundColor: isFrontendMentor
                        ? "#FFFFFF"
                        : platform.color,
                    }}
                  >
                    <div className="flex items-center gap-2">
                    <img 
                      src={platform.icon} 
                      alt={platform.name} 
                      className={`h-5 w-5 ${isFrontendMentor ? "" : "filter brightness-0 invert"}`} 
                      style={isFrontendMentor ? {} : { filter: "brightness(0) invert(1)" }}
                    />
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 ${isFrontendMentor ? "text-black" : "text-white"}`}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
