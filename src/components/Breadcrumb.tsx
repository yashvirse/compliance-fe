// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
// import { Home as HomeIcon, NavigateNext } from '@mui/icons-material';
// import { selectUser } from '../pages/login/slice/Login.selector';
// import { getDashboardPathForRole, UserRole } from '../config/roleConfig.tsx';

// const Breadcrumb: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const user = useSelector(selectUser);

//   const pathnames = location.pathname.split('/').filter((x) => x);

//   // Get role-specific dashboard path
//   const dashboardPath = user ? getDashboardPathForRole(user.role as UserRole) : '/dashboard';

//   const breadcrumbNameMap: { [key: string]: string } = {
//     dashboard: 'Dashboard',
//     master: 'Master',
//     user: 'User',
//     company: 'Company',
//     country: 'Country',
//     form: 'Form',
//     components: 'Components',
//     reports: 'Reports',
//     settings: 'Settings'
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Breadcrumbs
//         separator={<NavigateNext fontSize="small" />}
//         aria-label="breadcrumb"
//         sx={{
//           '& .MuiBreadcrumbs-separator': {
//             mx: 1
//           }
//         }}
//       >
//         <Link
//           component="button"
//           underline="hover"
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             color: 'primary.main',
//             cursor: 'pointer',
//             '&:hover': {
//               color: 'primary.dark'
//             }
//           }}
//           onClick={() => navigate(dashboardPath)}
//         >
//           <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
//           Home
//         </Link>

//         {pathnames.map((value, index) => {
//           const last = index === pathnames.length - 1;
//           const to = `/${pathnames.slice(0, index + 1).join('/')}`;
//           const label = breadcrumbNameMap[value] || value;

//           // Special handling for 'dashboard' breadcrumb - navigate to role-specific dashboard
//           const navigationPath = value === 'dashboard' && index === 0 ? dashboardPath : to;

//           return last ? (
//             <Typography
//               key={to}
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 color: 'text.primary',
//                 fontWeight: 500
//               }}
//             >
//               {label}
//             </Typography>
//           ) : (
//             <Link
//               key={to}
//               component="button"
//               underline="hover"
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 color: 'primary.main',
//                 cursor: 'pointer',
//                 '&:hover': {
//                   color: 'primary.dark'
//                 }
//               }}
//               onClick={() => navigate(navigationPath)}
//             >
//               {label}
//             </Link>
//           );
//         })}
//       </Breadcrumbs>
//     </Box>
//   );
// };

// export default Breadcrumb;
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { Home as HomeIcon, NavigateNext } from "@mui/icons-material";
import { selectUser } from "../pages/login/slice/Login.selector";
import { getDashboardPathForRole, UserRole } from "../config/roleConfig.tsx";

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  let pathnames = location.pathname.split("/").filter((x) => x);

  // Get role-specific dashboard path
  const dashboardPath = user
    ? getDashboardPathForRole(user.role as UserRole)
    : "/dashboard";

  const breadcrumbNameMap: { [key: string]: string } = {
    dashboard: "Dashboard",
    master: "Master",
    user: "User",
    company: "Company",
    country: "Country",
    form: "Form",
    components: "Components",
    reports: "Reports",
    settings: "Settings",
  };

  // Special handling: Agar path mein 'edit' aur uske baad id hai, toh usko replace kar do
  if (
    pathnames.includes("edit") &&
    pathnames.length > pathnames.indexOf("edit") + 1
  ) {
    const editIndex = pathnames.indexOf("edit");
    const parentSegment = pathnames[editIndex - 1]; // jaise 'company', 'country' etc.

    // Last two segments (edit + id) ko remove karke ek meaningful label bana do
    pathnames = pathnames.slice(0, editIndex); // edit aur id hata do
    const parentLabel = breadcrumbNameMap[parentSegment] || parentSegment;
    const editLabel = `Edit ${parentLabel}`;

    // Ab breadcrumb mein last item manually add karenge
    return (
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            "& .MuiBreadcrumbs-separator": {
              mx: 1,
            },
          }}
        >
          <Link
            component="button"
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "primary.main",
              cursor: "pointer",
              "&:hover": {
                color: "primary.dark",
              },
            }}
            onClick={() => navigate(dashboardPath)}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </Link>

          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const label = breadcrumbNameMap[value] || value;

            const navigationPath =
              value === "dashboard" && index === 0 ? dashboardPath : to;

            return last ? (
              <Typography
                key={to}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.primary",
                  fontWeight: 500,
                }}
              >
                {label}
              </Typography>
            ) : (
              <Link
                key={to}
                component="button"
                underline="hover"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                  cursor: "pointer",
                  "&:hover": {
                    color: "primary.dark",
                  },
                }}
                onClick={() => navigate(navigationPath)}
              >
                {label}
              </Link>
            );
          })}

          {/* Manually add "Edit Company" as last breadcrumb */}
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.primary",
              fontWeight: 500,
            }}
          >
            {editLabel}
          </Typography>
        </Breadcrumbs>
      </Box>
    );
  }

  // Normal case (non-edit paths)
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            mx: 1,
          },
        }}
      >
        <Link
          component="button"
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "primary.main",
            cursor: "pointer",
            "&:hover": {
              color: "primary.dark",
            },
          }}
          onClick={() => navigate(dashboardPath)}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </Link>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const label = breadcrumbNameMap[value] || value;

          const navigationPath =
            value === "dashboard" && index === 0 ? dashboardPath : to;

          return last ? (
            <Typography
              key={to}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.primary",
                fontWeight: 500,
              }}
            >
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              component="button"
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                cursor: "pointer",
                "&:hover": {
                  color: "primary.dark",
                },
              }}
              onClick={() => navigate(navigationPath)}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
