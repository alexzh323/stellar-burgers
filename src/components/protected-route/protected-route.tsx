type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth, children }: ProtectedRouteProps) => {
  return children;
}