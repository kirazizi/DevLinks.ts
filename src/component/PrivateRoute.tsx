import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { OrbitProgress } from 'react-loading-indicators';
import React, { ReactNode, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    users {
      id
      email
      first_name
      last_name
      image
      links {
        id
        platform
        url
      }
    }
  }
`;

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, setProfile, setLinks, loading: authLoading } = useAuth();
  const location = useLocation();

  // skip query if user is not authenticated
  const { loading: queryLoading, data, error } = useQuery(GET_USER_PROFILE, {
    skip: !user,
  });

  useEffect(() => {
    if (data) {
      setProfile((prev) => ({
        ...prev,
        id: data.users[0].id,
        first_name: data.users[0].first_name,
        last_name: data.users[0].last_name,
        email: data.users[0].email,
        image: data.users[0].image,
      }));

      const transformedLinks = data.users[0].links.map(({ id, platform, url }: { id: string, platform: string, url: string }) => ({
        id,
        platform,
        url,
        isNew: false,
      }));
      setLinks(transformedLinks);
    }
  }, [data]);

  if (authLoading || queryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <OrbitProgress variant="disc" color="#633CFF" size="medium" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (error){
    localStorage.removeItem('authToken');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;