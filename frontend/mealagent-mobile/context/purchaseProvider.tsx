import React, { createContext, useContext, useEffect, useState } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { User } from "./authContext";

const ENTITLEMENT_ID = "my_meal_agent_pro";

type BillingContextType = {
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  restore: () => Promise<void>;
  refresh: () => Promise<void>;
};

const BillingContext = createContext<BillingContextType | null>(null);

export function PurchasesProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!;
        console.log(`EXPO_PUBLIC_REVENUECAT_API_KEY = ${apiKey}`);

        Purchases.configure({
          apiKey,
          appUserID: user?.id.toString(),
        });

        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);

        Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
      } catch (e) {
        console.warn("RevenueCat init failed:", e);
      }
    }

    init();
  }, [user?.id]);

  const refresh = async () => {
    const info = await Purchases.getCustomerInfo();
    setCustomerInfo(info);
  };

  const restore = async () => {
    const info = await Purchases.restorePurchases();
    setCustomerInfo(info);
  };

  const isPremium =
    (customerInfo?.entitlements.active[ENTITLEMENT_ID] != null) ||
    (user?.plan == "Premium");

  return (
    <BillingContext.Provider value={{ isPremium, customerInfo, restore, refresh }}>
      {children}
    </BillingContext.Provider>
  );
}

export const useBilling = () => {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error("BillingProvider missing");
  return ctx;
};
