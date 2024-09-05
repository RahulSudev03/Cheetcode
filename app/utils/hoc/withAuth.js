import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      // Check if the authentication cookie is present
      const token = Cookies.get("token"); 

      if (!token) {
        // If no token is found, redirect to the sign-in page
        router.replace("/signin");
      }
    }, [router]);

    // If token exists, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
