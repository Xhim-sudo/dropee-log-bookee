
import React, { useState } from 'react';
import { Store, Plus, Edit, Trash2, Star, Phone, Mail, MapPin } from 'lucide-react';
import { useVendorData } from '../hooks/useVendorData';
import { useVendorMutations } from '../hooks/useVendorMutations';
import { VendorForm, VENDOR_TYPES } from '../types/vendor';

const VendorManagement: React.FC = () => {
  const { vendors, isLoading } = useVendorData();
  const { addVendor, updateVendor, deactivateVendor, isAdding } = useVendorMutations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);
  
  const [vendorForm, setVendorForm] = useState<VendorForm>({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    vendor_type: 'restaurant',
    rating: '',
    commission_rate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVendor) {
      updateVendor({ ...vendorForm, id: editingVendor });
      setEditingVendor(null);
    } else {
      addVendor(vendorForm);
    }
    
    setVendorForm({
      name: '', contact_person: '', phone: '', email: '', address: '',
      vendor_type: 'restaurant', rating: '', commission_rate: ''
    });
    setShowForm(false);
  };

  const handleEdit = (vendor: any) => {
    setVendorForm({
      name: vendor.name,
      contact_person: vendor.contact_person || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
      address: vendor.address,
      vendor_type: vendor.vendor_type,
      rating: vendor.rating?.toString() || '',
      commission_rate: vendor.commission_rate?.toString() || ''
    });
    setEditingVendor(vendor.id);
    setShowForm(true);
  };

  const handleDeactivate = (vendorId: string, vendorName: string) => {
    if (window.confirm(`Are you sure you want to deactivate ${vendorName}?`)) {
      deactivateVendor(vendorId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Store className="h-6 w-6 mr-3 text-indigo-600" />
          Vendor Management ({vendors.length} vendors)
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={vendorForm.contact_person}
                  onChange={(e) => setVendorForm({...vendorForm, contact_person: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={vendorForm.phone}
                  onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={vendorForm.email}
                  onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Type *
                </label>
                <select
                  required
                  value={vendorForm.vendor_type}
                  onChange={(e) => setVendorForm({...vendorForm, vendor_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {VENDOR_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={vendorForm.rating}
                  onChange={(e) => setVendorForm({...vendorForm, rating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={vendorForm.commission_rate}
                  onChange={(e) => setVendorForm({...vendorForm, commission_rate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                required
                rows={2}
                value={vendorForm.address}
                onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isAdding}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isAdding ? 'Saving...' : (editingVendor ? 'Update Vendor' : 'Add Vendor')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingVendor(null);
                  setVendorForm({
                    name: '', contact_person: '', phone: '', email: '', address: '',
                    vendor_type: 'restaurant', rating: '', commission_rate: ''
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {vendors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No vendors yet. Add your first vendor to get started.</p>
          </div>
        ) : (
          vendors.map(vendor => (
            <div key={vendor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{vendor.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {VENDOR_TYPES.find(t => t.value === vendor.vendor_type)?.label}
                    </span>
                    {vendor.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{vendor.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    {vendor.contact_person && (
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Contact:</span>
                        <span>{vendor.contact_person}</span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{vendor.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-1 mt-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{vendor.address}</span>
                  </div>
                  
                  {vendor.commission_rate && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-green-600">Commission: {vendor.commission_rate}%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(vendor)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit vendor"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeactivate(vendor.id, vendor.name)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Deactivate vendor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorManagement;
