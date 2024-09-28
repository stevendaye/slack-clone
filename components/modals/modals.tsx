"use client";

import React, { useEffect, useState } from "react";

import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal";
import { CreateChannelModel } from "./create-channel-modal";

export const Modals: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  /* Preventing Hydration Error: All Modals will show on CSR */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModel />
    </>
  );
};
