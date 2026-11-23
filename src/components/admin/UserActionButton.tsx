"use client";

import { Label, ListBox, Select } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserActionButtonProps {
  userId: string;
  role: string;
  disabled?: boolean;   // নিজের row-এর জন্য disable করতে
}

const ROLES = ["customer", "admin", "owner"] as const;

const UserActionButton = ({ userId, role, disabled }: UserActionButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role);

  const handleRoleChange = async (newRole: string | null) => {
    if (!newRole || newRole === selectedRole) return;

    setLoading(true);
    setSelectedRole(newRole); // optimistic

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/user/${userId}/role`,
        {
          method: "PATCH",
          credentials: "include",                    // ✅ cookie auth
          headers: {
            "Content-Type": "application/json",
            // JWT হলে: Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update role");
      }

      router.refresh();
    } catch (err) {
      setSelectedRole(role); // revert
      console.error("Role update failed:", err);
      alert(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      className="w-32"
      placeholder="Role"
      value={selectedRole}
      onChange={(key) => handleRoleChange(key as string | null)}
      isDisabled={loading || disabled}
    >
      <Label>Role</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {ROLES.map((r) => (
            <ListBox.Item key={r} id={r} textValue={r}>
              {r}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default UserActionButton;





// "use client";

// import { Label, ListBox, Select } from "@heroui/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// interface UserActionButtonProps {
//   userId: string;
//   role: string;
// }

// const ROLES = ["customer", "admin", "owner"] as const;

// const UserActionButton = ({ userId, role }: UserActionButtonProps) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(role);

//   const handleRoleChange = async (newRole: string | null) => {
//     if (!newRole || newRole === selectedRole) return;

//     setLoading(true);
//     setSelectedRole(newRole); // optimistic

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/user/${userId}/role`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ role: newRole }),
//         }
//       );

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.message || "Failed to update role");
//       }

//       router.refresh();
//     } catch (err) {
//       setSelectedRole(role); // revert
//       console.error("Role update failed:", err);
//       alert(err instanceof Error ? err.message : "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Select
//       className="w-32"
//       placeholder="Role"
//       value={selectedRole}
//       onChange={(key) => handleRoleChange(key as string | null)}
//       isDisabled={loading}
//     >
//       <Label>Role</Label>
//       <Select.Trigger>
//         <Select.Value />
//         <Select.Indicator />
//       </Select.Trigger>
//       <Select.Popover>
//         <ListBox>
//           {ROLES.map((r) => (
//             <ListBox.Item key={r} id={r} textValue={r}>
//               {r}
//               <ListBox.ItemIndicator />
//             </ListBox.Item>
//           ))}
//         </ListBox>
//       </Select.Popover>
//     </Select>
//   );
// };

// export default UserActionButton;