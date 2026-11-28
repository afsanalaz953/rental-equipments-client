import React from 'react';
          // ✅ নতুন import
import { Table } from '@heroui/react';
import Image from 'next/image';
import SearchProducts from '@/components/admin/SearchProducts';
import UserActionButton from '@/components/admin/UserActionButton';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  status?: string;
  isBlocked?: boolean;
  createdAt: string;
}

interface ManageUserPageProps {
  searchParams: Promise<{ search?: string }>;
}

const ManageUserPage = async ({ searchParams }: ManageUserPageProps) => {
  const sParams = await searchParams;
  const search = sParams?.search || '';

  const session = await auth.api.getSession({
       headers: await headers(), // you need to pass the headers object.
   });
   const user = session?.user;
   const userId = user?.id;
   console.log('currentUserId:', userId);

    const tokenObj = await auth.api.getToken({
       headers: await headers()
     })
     console.log(tokenObj, "adminUserToken") 

 

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users?search=${encodeURIComponent(
      search)}`,
    {
      cache: 'no-store',
      headers:{
     authorization: `Bearer ${tokenObj.token}`
      
 }
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API error ${res.status}: ${errorText}`);
    return <div>Failed to load user</div>;
  }
const userList: AdminUser[] = await res.json()
console.log(userList, "userlist in admin")

  // const userList: AdminUser[] = await res.json();

  // ✅ বর্তমান logged-in user (নিজের row-এ select disable করতে)
  // const currentUserId = cookieStore.get('userId')?.value; 
  // অথবা JWT decode করে / আলাদা API থেকে নিন

  return (
    <div>
      <h1 className="m-10 text-3xl font-bold text-orange-700">All Users</h1>

      <div className="m-10">
        <SearchProducts />
      </div>

      {!userList || userList.length === 0 ? (
        <div className="text-center bg-orange-100 rounded-lg shadow">
          <p className="text-gray-600 text-lg">No user available yet.</p>
          <p className="text-gray-500">Log in to get started.</p>
        </div>
      ) : (
        <div className="lg:w-full md:w-[760px] shadow-lg ml-30">
          <Table className="w-full bg-gray-200">
            <Table.ScrollContainer>
              <Table.Content aria-label="Team members">
                <Table.Header className="rounded bg-blue-900">
                  <Table.Column className="text-lg font-bold">Photo</Table.Column>
                  <Table.Column>User Id</Table.Column>
                  <Table.Column isRowHeader className="text-lg font-bold">User</Table.Column>
                  <Table.Column className="text-lg font-bold">Email</Table.Column>
                  <Table.Column className="text-lg font-bold">Role</Table.Column>
                  <Table.Column className="text-lg font-bold">Status</Table.Column>
                  <Table.Column className="text-lg font-bold">Joined</Table.Column>
                  <Table.Column className="text-lg font-bold text-center">Action</Table.Column>
                </Table.Header>

                <Table.Body>
                  {userList.map((adUser) => (
                    <Table.Row key={adUser._id}>
                      <Table.Cell>
                        {adUser.image ? (
                          <Image
                            src={adUser.image}
                            alt={adUser.name}
                            width={70}
                            height={70}
                            className="rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-[70px] h-[70px] rounded-full bg-gray-300" />
                        )}
                      </Table.Cell>
                      <Table.Cell>{adUser._id}</Table.Cell>
                      <Table.Cell className="hover:text-blue-800 hover:underline">
                        {adUser.name}
                      </Table.Cell>
                      <Table.Cell>{adUser.email}</Table.Cell>
                      <Table.Cell>{adUser.role}</Table.Cell>
                      <Table.Cell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
                            adUser.status === 'blocked'
                              ? 'bg-red-600'
                              : 'bg-green-600'
                          }`}
                        >
                          {adUser.status ?? 'active'}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(adUser.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <UserActionButton
                          userId={adUser._id}
                          role={adUser.role}
                          disabled={adUser._id === userId}   // ✅ akhane currentUserId siloনিজের role বদলানো যাবে না
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ManageUserPage;






// import React from 'react';
// import { Table } from '@heroui/react';
// import Image from 'next/image';
// import SearchProducts from '@/components/admin/SearchProducts';
// import UserActionButton from '@/components/admin/UserActionButton';

// interface AdminUser {
//   _id: string;
//   name: string;
//   email: string;
//   image?: string | null;
//   role: string;
//   status?: string;
//   isBlocked?: boolean;
//   createdAt: string;
// }

// interface ManageUserPageProps {
//   // Next.js 15: searchParams is a Promise
//   searchParams: Promise<{ search?: string }>;
// }

// const ManageUserPage = async ({ searchParams }: ManageUserPageProps) => {
//   const sParams = await searchParams;
//   const search = sParams?.search || '';

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users?search=${encodeURIComponent(
//       search
//     )}`,
//     { cache: 'no-store' }
//   );

//   if (!res.ok) {
//     const errorText = await res.text();
//     console.error(`API error ${res.status}: ${errorText}`);
//     return <div>Failed to load user</div>;
//   }

//   const userList: AdminUser[] = await res.json();

//   return (
//     <div>
//       <h1 className="m-10 text-3xl font-bold text-orange-700">All Users</h1>

//       <div className="m-10">
//         <SearchProducts />
//       </div>

//       {!userList || userList.length === 0 ? (
//         <div className="text-center bg-orange-100 rounded-lg shadow">
//           <p className="text-gray-600 text-lg">No user available yet.</p>
//           <p className="text-gray-500">Log in to get started.</p>
//         </div>
//       ) : (
//         <div className="lg:w-full md:w-[760px] shadow-lg ml-30">
//           <Table className="w-full bg-gray-200">
//             <Table.ScrollContainer>
//               <Table.Content aria-label="Team members">
//                 <Table.Header className="rounded bg-blue-900">
//                   <Table.Column className="text-lg font-bold">Photo</Table.Column>
//                   <Table.Column>User Id</Table.Column>
//                   <Table.Column isRowHeader className="text-lg font-bold">
//                     User
//                   </Table.Column>
//                   <Table.Column className="text-lg font-bold">Email</Table.Column>
//                   <Table.Column className="text-lg font-bold">Role</Table.Column>
//                   <Table.Column className="text-lg font-bold">Status</Table.Column>
//                   <Table.Column className="text-lg font-bold">Joined</Table.Column>
//                   <Table.Column className="text-lg font-bold text-center">
//                     Action
//                   </Table.Column>
//                 </Table.Header>

//                 <Table.Body>
//                   {userList.map((adUser) => (
//                     <Table.Row key={adUser._id}>
//                       <Table.Cell>
//                         {adUser.image ? (
//                           <Image
//                             src={adUser.image}
//                             alt={adUser.name}
//                             width={70}
//                             height={70}
//                             className="rounded-full object-cover"
//                             unoptimized
//                           />
//                         ) : (
//                           <div className="w-[70px] h-[70px] rounded-full bg-gray-300" />
//                         )}
//                       </Table.Cell>

//                       <Table.Cell>{adUser._id}</Table.Cell>

//                       <Table.Cell className="hover:text-blue-800 hover:underline">
//                         {adUser.name}
//                       </Table.Cell>

//                       <Table.Cell>{adUser.email}</Table.Cell>
//                       <Table.Cell>{adUser.role}</Table.Cell>

//                       <Table.Cell>
//                         <span
//                           className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
//                             adUser.status === 'blocked'
//                               ? 'bg-red-600'
//                               : 'bg-green-600'
//                           }`}
//                         >
//                           {adUser.status ?? 'active'}
//                         </span>
//                       </Table.Cell>

//                       <Table.Cell>
//                         {new Date(adUser.createdAt).toLocaleDateString()}
//                       </Table.Cell>

//                       {/* Action cell */}
//                       <Table.Cell>
//                         <UserActionButton
//                           userId={adUser._id}
//                           role={adUser.role}
//                         />
//                       </Table.Cell>
//                     </Table.Row>
//                   ))}
//                 </Table.Body>
//               </Table.Content>
//             </Table.ScrollContainer>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageUserPage;




// // import React from 'react';
// // import { Table } from '@heroui/react';
// // import Image from 'next/image';
// // import SearchProducts from '@/components/admin/SearchProducts';
// // import UserActionButton from '@/components/admin/UserActionButton';

// // interface AdminUser {
// //   _id: string;
// //   name: string;
// //   email: string;
// //   image?: string | null;
// //   role: string;
// //   status: string;         // 'active' | 'blocked' | ...
// //   isBlocked?: boolean;
// //   createdAt: string;
// // }

// // interface ManageUserPageProps {
// //   // Next.js 15: searchParams is a Promise
// //   searchParams: Promise<{ search?: string }>;
// // }

// // const ManageUserPage = async ({ searchParams }: ManageUserPageProps) => {
// //   const sParams = await searchParams;
// //   const search = sParams?.search || '';

// //   const res = await fetch(
// //     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users?search=${encodeURIComponent(
// //       search
// //     )}`,
// //     { cache: 'no-store' }
// //   );

// //   if (!res.ok) {
// //     const errorText = await res.text();
// //     console.error(`API error ${res.status}: ${errorText}`);
// //     return <div>Failed to load user</div>;
// //   }

// //   const userList: AdminUser[] = await res.json();
// //   console.log(userList, 'userlist');

// //   return (
// //     <div>
// //       <h1 className="m-10 text-3xl font-bold text-orange-700">All Users</h1>

// //       <div className="m-10">
// //         <SearchProducts />
// //       </div>

// //       {!userList || userList.length === 0 ? (
// //         <div className="text-center bg-orange-100 rounded-lg shadow">
// //           <p className="text-gray-600 text-lg">No user available yet.</p>
// //           <p className="text-gray-500">Log in to get started.</p>
// //         </div>
// //       ) : (
// //         <div className="lg:w-full md:w-[760px] shadow-lg ml-30">
// //           <Table className="w-full bg-gray-200">
// //             <Table.ScrollContainer>
// //               <Table.Content aria-label="Team members">
// //                 <Table.Header className="rounded bg-blue-900">
// //                   <Table.Column className="text-lg font-bold">Photo</Table.Column>
// //                   <Table.Column>User Id</Table.Column>
// //                   <Table.Column isRowHeader className="text-lg font-bold">
// //                     User
// //                   </Table.Column>
// //                   <Table.Column className="text-lg font-bold">Email</Table.Column>
// //                   <Table.Column className="text-lg font-bold">Role</Table.Column>
// //                   <Table.Column className="text-lg font-bold">Status</Table.Column>
// //                   <Table.Column className="text-lg font-bold">Joined</Table.Column>
// //                   {/* Action column – hidden for now */}
// //                   <Table.Column className="text-lg font-bold text-center w-0.5">
// //                     Action
// //                   </Table.Column>
                 
// //                 </Table.Header>

// //                 <Table.Body>
// //                   {userList.map((adUser) => (
// //                     <Table.Row key={adUser._id}>
// //                       <Table.Cell>
// //                         {adUser.image ? (
// //                           <Image
// //                             src={adUser.image}
// //                             alt={adUser.name}
// //                             width={70}
// //                             height={70}
// //                             className="rounded-full object-cover"
// //                             unoptimized
// //                           />
// //                         ) : (
// //                           <div className="w-[70px] h-[70px] rounded-full bg-gray-300" />
// //                         )}
// //                       </Table.Cell>

// //                       <Table.Cell>{adUser._id}</Table.Cell>

// //                       <Table.Cell className="hover:text-blue-800 hover:underline">
// //                         {adUser.name}
// //                       </Table.Cell>

// //                       <Table.Cell>{adUser.email}</Table.Cell>
// //                       <Table.Cell>{adUser.role}</Table.Cell>

// //                       <Table.Cell>
// //                         <span
// //                           className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
// //                             adUser.status === 'blocked'
// //                               ? 'bg-red-600'
// //                               : 'bg-green-600'
// //                           }`}
// //                         >
// //                           {adUser.status}
// //                         </span>
// //                       </Table.Cell>

// //                       <Table.Cell>
// //                         {new Date(adUser.createdAt).toLocaleDateString()}
// //                       </Table.Cell>

// //                       Action cell – re-enable when UserActionButton is ready
// //                       <Table.Cell className="flex gap-2 bg-white p-2">
// //                         <UserActionButton
// //                           userId={adUser._id}
// //                           isBlocked={adUser.isBlocked}
// //                         />
// //                       </Table.Cell>
                     
// //                     </Table.Row>
// //                   ))}
// //                 </Table.Body>
// //               </Table.Content>
// //             </Table.ScrollContainer>
// //           </Table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ManageUserPage;