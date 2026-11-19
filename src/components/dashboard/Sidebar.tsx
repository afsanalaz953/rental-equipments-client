import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Bars, Bell, Envelope, House, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

// 1. Define the roles your app supports
type DashboardRole = "owner" | "customer" | "admin";

// 2. Define the shape of each sidebar link
interface NavItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  link: string;
}

// 3. Type the map so every role is required to have an array
const dashboardItems: Record<DashboardRole, NavItem[]> = {
  owner: [
    { icon: House, label: "Overview", link: "/dashboard/owner" },
    { icon: Magnifier, label: "Add Equipment", link: "/dashboard/owner/addequipments" },
    { icon: Bell, label: "My Equipments", link: "/dashboard/owner/myequipments" },
    { icon: Envelope, label: "My Rental Equipments", link: "/dashboard/owner/myrentalequipments" },
    { icon: Person, label: "My Profile", link: "/dashboard/owner/profile" },
  ],
  customer: [
    { icon: House, label: "Overview", link: "/dashboard/customer" },
    { icon: Magnifier, label: "My Rentals", link: "/dashboard/customer/myrentals" },
    { icon: Bell, label: "Favorites", link: "/dashboard/customer/favorites" },
    { icon: Person, label: "Profile", link: "/dashboard/customer/profile" },
  ],
  admin: [
    { icon: House, label: "Overview", link: "/dashboard/admin" },
    { icon: Magnifier, label: "All Users", link: "/dashboard/admin/allusers" },
    { icon: Bell, label: "All Equipment", link: "/dashboard/admin/allequipments" },
    { icon: Envelope, label: "All Rentals", link: "/dashboard/admin/allrentals" },
    { icon: Person, label: "My Profile", link: "/dashboard/admin/profile" },
  ],
};

// 4. Type guard — safer than a raw `as` cast, since it
//    falls back to "customer" for any unexpected value
function isDashboardRole(value: unknown): value is DashboardRole {
  return value === "owner" || value === "customer" || value === "admin";
}

export default async function DashboardSidebar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const rawRole = user?.role;
  const role: DashboardRole = isDashboardRole(rawRole) ? rawRole : "customer";

  const navItems: NavItem[] = dashboardItems[role];

  return (
    <Drawer>
      <Button className="hidden" variant="secondary">
        <Bars />
        Menu
      </Button>
      <div className="font-bold text-orange-500 text-2xl border-b mt-0 pt-0">
        ReSell Hub
      </div>
      <nav className="flex flex-col gap-1 mt-10">
        {navItems.map((item) => (
          <Link key={item.label} href={item.link}>
            <button
              className="flex items-center gap-3 rounded-xl px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#FF6900]"
              type="button"
            >
              <item.icon className="size-5 text-muted" />
              {item.label}
            </button>
          </Link>
        ))}
      </nav>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>{/* ... */}</Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}





// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import {Bars, Bell, Envelope, House, Magnifier, Person} from "@gravity-ui/icons";
// import {Button, Drawer} from "@heroui/react";
// // import { role } from "better-auth/plugins";
// import Link from "next/link";
// import type { ComponentType, SVGProps } from "react";

// // 1. Define the roles your app supports
// type DashboardRole = "owner" | "customer" | "admin";

// // 2. Define the shape of each sidebar link
// interface NavItem {
//   icon: ComponentType<SVGProps<SVGSVGElement>>;
//   label: string;
//   link: string;
// }


// export default async function DashboardSidebar() {
// const session = await auth.api.getSession({
//   headers: await headers()
// })
// const user = session?.user 
// const role = user?.role || 'customer'
// // console.log(role, "role")
// // console.log(user, "user")

// const dashboardItems={
//  owner: [
//   {icon: House, label: "Overview", link:'/dashboard/owner'},
//     {icon: Magnifier, label: "Add Equipment", link:'/dashboard/owner/addequipments'},
//     {icon: Bell, label: "My Equipments", link: '/dashboard/owner/myequipments'},
//     {icon: Envelope, label: "My Rental Equipments ", link:'/dashboard/owner/myrentalequipments'},
//     {icon: Person, label: "My Profile", link: '/dashboard/owner/profile'},
//     // {icon: Gear, label: "Settings"},

//  ],
// customer: [
//   {icon: House, label: "Overview", link:'/dashboard/customer'},
//     {icon: Magnifier, label: "My Rentals", link:'/dashboard/customer/myrentals'},
//     {icon: Bell, label: "Favorites",link:'/dashboard/customer/favorites' },
//     // {icon: Envelope, label: "Payments", link:'/dashboard/customer/payment'},
//     {icon: Person, label: "Profile",link:'/dashboard/customer/profile' },
//     // {icon: Gear, label: "Settings"},

//  ],
//  admin:[
//   {icon: House, label: "Overview", link:'/dashboard/admin'},
//     {icon: Magnifier, label: "All Users", link:'/dashboard/admin/allusers'},
//     {icon: Bell, label: "All Equipment", link:'/dashboard/admin/allequipments'},
//     {icon: Envelope, label: "All Rentals", link:'/dashboard/admin/allrentals'},
//     {icon: Person, label: "My Profile", link:'/dashboard/admin/profile'},
//     // {icon: Gear, label: "Settings"},

//  ],

// };

 


// const navItems: NavItem[] = dashboardItems[role]
// console.log(navItems, "navitems")



//   // const navItems = [
//   //   {icon: House, label: "Home"},
//   //   {icon: Magnifier, label: "Search"},
//   //   {icon: Bell, label: "Notifications"},
//   //   {icon: Envelope, label: "Messages"},
//   //   {icon: Person, label: "Profile"},
//   //   {icon: Gear, label: "Settings"},
//   // ];

//   return (
    
//     <Drawer>
       
//       <Button  className= {'hidden'} variant="secondary">
//         <Bars />
//         Menu
//       </Button>
//       <div className="font-bold text-orange-500 text-2xl border-b mt-0 pt-0 ">
//          ReSell Hub 
//         </div>
//       <nav className="flex flex-col gap-1 mt-10">
       
//                 {navItems.map((item) => (
//                   <Link key={item.label} href={item.link} > 
//                   <button
                   
                    
//                     className="flex items-center gap-3 rounded-xl px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#FF6900]"
//                     type="button"
//                   >
//                     <item.icon className="size-5 text-muted" />
//                     {item.label}
//                   </button>
//                     </Link>
//                 ))}
//               </nav>
//       <Drawer.Backdrop>
//         <Drawer.Content placement="left">
//           <Drawer.Dialog>
//             <Drawer.CloseTrigger />
//             <Drawer.Header>
//               <Drawer.Heading>Navigation</Drawer.Heading>
//             </Drawer.Header>
//             <Drawer.Body>
              
//             </Drawer.Body>
//           </Drawer.Dialog>
//         </Drawer.Content>
//       </Drawer.Backdrop>
//     </Drawer>
//   );
// }