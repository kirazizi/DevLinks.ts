import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { Typography, Button } from "@material-tailwind/react";
import Logo from "../assets/images/logo-devlinks-small.svg";
import { OrbitProgress } from 'react-loading-indicators';

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

interface Link {
  id: string;
  platform: string;
  url: string;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  links: Link[];
}

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

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_HASURA_GRAPHQL_URL,
          {
            query: `
              query GetUserProfile($userId: String!) {
                users_by_pk(id: $userId) {
                  id
                  first_name
                  last_name
                  email
                  image
                  links {
                    id
                    platform
                    url
                  }
                }
              }
            `,
            variables: {
              userId,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': import.meta.env.VITE_HASURA_X_SECRET,
            },
          }
        );

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        setProfile(response.data.data.users_by_pk);
        setLinks(response.data.data.users_by_pk.links);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <OrbitProgress variant="disc" color="#633CFF" size="medium" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-screen mx-auto grid place-items-center text-center px-8">
        <div>
          <img src={Logo} className="w-14 h-14 mx-auto" alt="Logo" />
          <Typography
            variant="h1"
            className="mt-10 !text-3xl !leading-snug md:!text-4xl text-[#633CFF]"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Error 404 <br /> It looks like something went wrong.
          </Typography>
          <Typography 
            className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Don&apos;t worry, our team is already on it. Please try refreshing
            the page or come back later.
          </Typography>
          <Button
            onClick={() => {
              navigate("/dashboard");
            }}
            className="w-full px-4 md:w-[8rem] bg-[#633CFF]"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto relative bg-white min-h-screen">
      <div className="top-0 left-0 right-0 h-[300px] bg-[#633CFF] rounded-b-[32px]" />
      <div className="relative">
        <div className="mt-[-160px] px-4 w-[300px] align-center mx-auto">
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
                const platformData = platforms[platformKey] || platforms.github;
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
                        : platformData.color,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={platformData.icon}
                        alt={platformData.name}
                        className={`h-5 w-5 ${isFrontendMentor ? "" : "filter brightness-0 invert"}`} 
                        style={isFrontendMentor ? {} : { filter: "brightness(0) invert(1)" }}
                      />
                      <span className="font-medium">{platformData.name}</span>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 ${
                        isFrontendMentor ? "text-black" : "text-white"
                      }`}
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
};

export default PublicProfilePage;