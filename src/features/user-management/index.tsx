import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  MoreVertical,
  UserPlus,
  Shield,
  UserX,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "support" | "viewer";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

const UserManagement = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<
    "all" | "admin" | "manager" | "support" | "viewer"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");

  // Static data
  const users: User[] = [
    {
      id: "1",
      fullName: "Ahmed Al-Mansouri",
      email: "ahmed.almansouri@debtbox.sa",
      phone: "+966 50 123 4567",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15T10:30:00",
      createdAt: "2023-06-15",
    },
    {
      id: "2",
      fullName: "Fatima Al-Zahra",
      email: "fatima.alzahra@debtbox.sa",
      phone: "+966 55 234 5678",
      role: "manager",
      status: "active",
      lastLogin: "2024-01-15T09:15:00",
      createdAt: "2023-07-20",
    },
    {
      id: "3",
      fullName: "Mohammed Al-Saud",
      email: "mohammed.alsaud@debtbox.sa",
      phone: "+966 54 345 6789",
      role: "support",
      status: "active",
      lastLogin: "2024-01-14T16:45:00",
      createdAt: "2023-08-10",
    },
    {
      id: "4",
      fullName: "Sara Al-Otaibi",
      email: "sara.alotaibi@debtbox.sa",
      phone: "+966 53 456 7890",
      role: "support",
      status: "inactive",
      lastLogin: "2024-01-10T14:20:00",
      createdAt: "2023-09-05",
    },
    {
      id: "5",
      fullName: "Khalid Al-Rashid",
      email: "khalid.alrashid@debtbox.sa",
      phone: "+966 52 567 8901",
      role: "viewer",
      status: "active",
      lastLogin: "2024-01-15T11:00:00",
      createdAt: "2023-10-12",
    },
    {
      id: "6",
      fullName: "Noura Al-Mutairi",
      email: "noura.almutairi@debtbox.sa",
      phone: "+966 51 678 9012",
      role: "manager",
      status: "suspended",
      lastLogin: "2024-01-05T08:30:00",
      createdAt: "2023-11-18",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: {
        label: t("userManagement.roles.admin", "Admin"),
        color: "bg-purple-100 text-purple-800",
      },
      manager: {
        label: t("userManagement.roles.manager", "Manager"),
        color: "bg-blue-100 text-blue-800",
      },
      support: {
        label: t("userManagement.roles.support", "Support"),
        color: "bg-green-100 text-green-800",
      },
      viewer: {
        label: t("userManagement.roles.viewer", "Viewer"),
        color: "bg-gray-100 text-gray-800",
      },
    };
    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${config.color}`}
      >
        <Shield className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            {t("userManagement.status.active", "Active")}
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            {t("userManagement.status.suspended", "Suspended")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {t("userManagement.status.inactive", "Inactive")}
          </span>
        );
    }
  };

  const stats = [
    {
      label: t("userManagement.totalUsers", "Total Users"),
      value: users.length,
      icon: UserPlus,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: t("userManagement.activeUsers", "Active"),
      value: users.filter((u) => u.status === "active").length,
      icon: Shield,
      color: "text-green-600 bg-green-50",
    },
    {
      label: t("userManagement.inactiveUsers", "Inactive"),
      value: users.filter((u) => u.status === "inactive").length,
      icon: UserX,
      color: "text-gray-600 bg-gray-50",
    },
    {
      label: t("userManagement.suspendedUsers", "Suspended"),
      value: users.filter((u) => u.status === "suspended").length,
      icon: UserX,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("userManagement.title", "User Management")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t(
              "userManagement.subtitle",
              "Manage system users and their permissions"
            )}
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg">
          <Plus className="w-4 h-4" />
          <span>{t("userManagement.addUser", "Add User")}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t(
                "userManagement.searchPlaceholder",
                "Search users..."
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterRole}
              onChange={(e) =>
                setFilterRole(
                  e.target.value as
                    | "all"
                    | "admin"
                    | "manager"
                    | "support"
                    | "viewer"
                )
              }
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">
                {t("userManagement.allRoles", "All Roles")}
              </option>
              <option value="admin">
                {t("userManagement.roles.admin", "Admin")}
              </option>
              <option value="manager">
                {t("userManagement.roles.manager", "Manager")}
              </option>
              <option value="support">
                {t("userManagement.roles.support", "Support")}
              </option>
              <option value="viewer">
                {t("userManagement.roles.viewer", "Viewer")}
              </option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "active" | "inactive" | "suspended"
                )
              }
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">
                {t("userManagement.allStatuses", "All Statuses")}
              </option>
              <option value="active">
                {t("userManagement.status.active", "Active")}
              </option>
              <option value="inactive">
                {t("userManagement.status.inactive", "Inactive")}
              </option>
              <option value="suspended">
                {t("userManagement.status.suspended", "Suspended")}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t("userManagement.user", "User")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t("userManagement.contact", "Contact")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t("userManagement.role", "Role")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t("userManagement.statusLabel", "Status")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t("userManagement.lastLogin", "Last Login")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t("common.actions", "Actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      {t("userManagement.noUsers", "No users found")}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary font-semibold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t("userManagement.joined", "Joined")}{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(user.lastLogin).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-primary hover:text-primary-dark font-medium">
                          {t("common.edit", "Edit")}
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const UserManagementRoutes = () => {
  return <UserManagement />;
};
