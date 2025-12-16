import { useTranslation } from 'react-i18next';
import { Search, CheckCircle2, XCircle, Clock, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

interface BusinessApproval {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  registrationNumber: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
}

const BusinessApprovals = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Static data
  const businesses: BusinessApproval[] = [
    {
      id: '1',
      businessName: 'Al-Rashid Trading Co.',
      ownerName: 'Ahmed Al-Rashid',
      email: 'ahmed@alrashid.com',
      phone: '+966 50 123 4567',
      location: 'Riyadh, Saudi Arabia',
      registrationNumber: 'CR-1234567890',
      submittedDate: '2024-01-15',
      status: 'pending',
      category: 'Retail',
    },
    {
      id: '2',
      businessName: 'Tech Solutions LLC',
      ownerName: 'Mohammed Al-Saud',
      email: 'mohammed@techsolutions.sa',
      phone: '+966 55 234 5678',
      location: 'Jeddah, Saudi Arabia',
      registrationNumber: 'CR-2345678901',
      submittedDate: '2024-01-14',
      status: 'approved',
      category: 'Technology',
    },
    {
      id: '3',
      businessName: 'Green Energy Services',
      ownerName: 'Fatima Al-Zahra',
      email: 'fatima@greenenergy.sa',
      phone: '+966 54 345 6789',
      location: 'Dammam, Saudi Arabia',
      registrationNumber: 'CR-3456789012',
      submittedDate: '2024-01-13',
      status: 'rejected',
      category: 'Energy',
    },
    {
      id: '4',
      businessName: 'Modern Fashion Boutique',
      ownerName: 'Sara Al-Mansouri',
      email: 'sara@modernfashion.sa',
      phone: '+966 53 456 7890',
      location: 'Riyadh, Saudi Arabia',
      registrationNumber: 'CR-4567890123',
      submittedDate: '2024-01-12',
      status: 'pending',
      category: 'Fashion',
    },
    {
      id: '5',
      businessName: 'Golden Restaurant Group',
      ownerName: 'Khalid Al-Otaibi',
      email: 'khalid@goldenrestaurant.sa',
      phone: '+966 52 567 8901',
      location: 'Jeddah, Saudi Arabia',
      registrationNumber: 'CR-5678901234',
      submittedDate: '2024-01-11',
      status: 'approved',
      category: 'Food & Beverage',
    },
  ];

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || business.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('businessApprovals.approved', 'Approved')}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            {t('businessApprovals.rejected', 'Rejected')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {t('businessApprovals.pending', 'Pending')}
          </span>
        );
    }
  };

  const stats = [
    {
      label: t('businessApprovals.total', 'Total Applications'),
      value: businesses.length,
      icon: Building2,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: t('businessApprovals.pending', 'Pending'),
      value: businesses.filter((b) => b.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: t('businessApprovals.approved', 'Approved'),
      value: businesses.filter((b) => b.status === 'approved').length,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: t('businessApprovals.rejected', 'Rejected'),
      value: businesses.filter((b) => b.status === 'rejected').length,
      icon: XCircle,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('businessApprovals.title', 'Business Approvals')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('businessApprovals.subtitle', 'Review and manage business registration applications')}
          </p>
        </div>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
              placeholder={t('businessApprovals.searchPlaceholder', 'Search businesses...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`businessApprovals.${status}`, status.charAt(0).toUpperCase() + status.slice(1))}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t('businessApprovals.businessName', 'Business Name')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t('businessApprovals.owner', 'Owner')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t('businessApprovals.contact', 'Contact')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t('businessApprovals.category', 'Category')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t('businessApprovals.submittedDate', 'Submitted')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t('businessApprovals.status', 'Status')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t('common.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      {t('businessApprovals.noBusinesses', 'No businesses found')}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {business.businessName}
                          </div>
                          <div className="text-xs text-gray-500">{business.registrationNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{business.ownerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {business.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {business.phone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {business.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                        {business.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(business.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(business.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {business.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-800 font-medium">
                              {t('businessApprovals.approve', 'Approve')}
                            </button>
                            <button className="text-red-600 hover:text-red-800 font-medium">
                              {t('businessApprovals.reject', 'Reject')}
                            </button>
                          </>
                        )}
                        <button className="text-primary hover:text-primary-dark font-medium">
                          {t('common.view', 'View')}
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

export const BusinessApprovalsRoutes = () => {
  return <BusinessApprovals />;
};


