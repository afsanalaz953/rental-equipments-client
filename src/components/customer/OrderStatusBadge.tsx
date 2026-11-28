// components/OrderStatusBadge.tsx
'use client';

import { Chip, Button, ButtonGroup } from '@heroui/react';
import { toast } from 'react-toastify';
import { useState } from 'react';

type OrderStatus = 'pending' | 'delivered' | 'canceled' | string;

type ChipColor = 'default' | 'success' | 'danger' | 'warning' | 'accent';

interface StatusConfig {
  color: ChipColor;
  label: string;
  icon: string;
}

interface OrderStatusBadgeProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

export default function OrderStatusBadge({ orderId, currentStatus, onStatusUpdate }: OrderStatusBadgeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  console.log(currentStatus, "ordercurrentstatus", onStatusUpdate, "updatedstatus")

  // স্ট্যাটাস অনুযায়ী ব্যাজের কালার ও টেক্সট
  const getStatusConfig = (status: OrderStatus): StatusConfig => {
    switch (status) {
      case 'pending':
        return { color: 'warning', label: 'Pending', icon: '⏳' };
      case 'delivered':
        return { color: 'success', label: 'Delivered', icon: '✅' };
      case 'canceled':
        return { color: 'danger', label: 'Canceled', icon: '❌' };
      default:
        return { color: 'default', label: status, icon: '' };
    }
  };

  const config = getStatusConfig(currentStatus);

  // API কল করে স্ট্যাটাস আপডেট
  const updateStatus = async (newStatus: string): Promise<void> => {
    if (loading || currentStatus === newStatus) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }
      toast.success(`Order status updated to ${newStatus}`);
      // প্যারেন্ট কম্পোনেন্টকে জানাই যে স্ট্যাটাস পরিবর্তন হয়েছে
      onStatusUpdate && onStatusUpdate(orderId, newStatus);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // শুধুমাত্র pending হলে অ্যাকশন বাটন দেখাবে
  const isPending = currentStatus === 'pending';

  return (
    <div className="flex items-center gap-2">
      {/* স্ট্যাটাস ব্যাজ */}
      <Chip color={config.color} variant="soft" size="sm" className='bg-green-400'>
        {config.icon} {config.label}
      </Chip>

      {/* অ্যাকশন বাটন (শুধু pending অবস্থায়) */}
      {isPending && (
        <ButtonGroup size="sm" variant="primary">
          <Button
            variant="primary"
            isDisabled={loading}
            onPress={() => updateStatus('delivered')}
          >
            Deliver
          </Button>
          <Button
            variant="danger"
            isDisabled={loading}
            onPress={() => updateStatus('canceled')}
          >
            Cancel
          </Button>
        </ButtonGroup>
      )}

      {/* যদি pending না হয়, তখন একটি ছোট টেক্সট দেখাতে পারি */}
      {!isPending && (
        <span className="text-xs text-gray-400 ml-1"></span>
      )}
    </div>
  );
}