
import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useVendorData } from '../../hooks/useVendorData';
import { useVendorMutations } from '../../hooks/useVendorMutations';
import { VendorForm, VENDOR_TYPES } from '../../types/vendor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface VendorSelectorProps {
  vendorId: string;
  onVendorChange: (vendorId: string) => void;
}

export const VendorSelector: React.FC<VendorSelectorProps> = ({
  vendorId,
  onVendorChange
}) => {
  const { vendors } = useVendorData();
  const { addVendor, isAdding } = useVendorMutations();
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newVendor, setNewVendor] = useState<VendorForm>({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    vendor_type: 'restaurant',
    rating: '',
    commission_rate: ''
  });

  const handleAddVendor = () => {
    if (newVendor.name && newVendor.address) {
      addVendor(newVendor);
      setNewVendor({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        vendor_type: 'restaurant',
        rating: '',
        commission_rate: ''
      });
      setShowAddVendor(false);
    }
  };

  return (
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Vendor/Pickup Location
      </Label>
      <div className="flex gap-2">
        <Select value={vendorId} onValueChange={onVendorChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select vendor or pickup location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No specific vendor</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{vendor.name}</span>
                  <span className="ml-2 text-xs text-gray-500">({vendor.vendor_type})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendor-name">Vendor Name *</Label>
                <Input
                  id="vendor-name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Pizza Palace"
                />
              </div>
              
              <div>
                <Label htmlFor="vendor-type">Type</Label>
                <Select
                  value={newVendor.vendor_type}
                  onValueChange={(value) => setNewVendor(prev => ({ ...prev, vendor_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VENDOR_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="vendor-address">Address *</Label>
                <Input
                  id="vendor-address"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Full address"
                />
              </div>
              
              <div>
                <Label htmlFor="vendor-phone">Phone</Label>
                <Input
                  id="vendor-phone"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Contact number"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAddVendor}
                  disabled={!newVendor.name || !newVendor.address || isAdding}
                  className="flex-1"
                >
                  {isAdding ? 'Adding...' : 'Add Vendor'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddVendor(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
