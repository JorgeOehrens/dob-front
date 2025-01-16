import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePoolForm } from "@/components/PoolComponents/Create/CreatePool";
import { AddParticipantsForm } from "@/components/PoolComponents/Participants/Participants";
import { DistributionPoolBalance } from "@/components/PoolComponents/Distribution/DistributionPoolBalance";
import ViewPools from "@/components/PoolComponents/Pool/Details";
import { CONTRACT_DATA, CONTRACT_FACTORY } from "@/app/consts";
import SailsCalls from "@/app/SailsCalls";
import { createClient } from "@supabase/supabase-js";
import { ClaimRewards } from "@/components/PoolComponents/Claim/ClaimPool";
import { SendVara } from "@/components/PoolComponents/SendVara/SendVara";

const supabase = createClient(
  "https://lwmvtiydijytxugorjrd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bXZ0aXlkaWp5dHh1Z29yanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDQ1ODcsImV4cCI6MjA1MDgyMDU4N30.hGCsLUY_N9RyJg0iebs5IgONMhKjv3lMgkuj_zcOZMY"
);

export const Pool = () => {
  const [pools, setPools] = useState<any[]>([]); // Almacena las pools desde Supabase
  const [tokens, setTokens] = useState<any[]>([]); // Almacena los VFT desde Supabase
  const [activeTab, setActiveTab] = useState("create-pool");
  const [selectedPool, setSelectedPool] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [distributionAddress, setDistributionAddress] = useState("");
  const [distributionType, setDistributionType] = useState("");
  const [distribution, setDistribution] = useState("");
  const [newParticipant, setNewParticipant] = useState("");

  // Función para obtener pools desde Supabase
  async function fetchPools() {
    const { data, error } = await supabase.from("pools").select();
    if (error) {
      console.error("Error fetching pools:", error);
      return;
    }
    setPools(data || []);
  }

  // Función para obtener tokens desde Supabase
  async function fetchTokens() {
    const { data, error } = await supabase.from("tokens").select();
    if (error) {
      console.error("Error fetching tokens:", error);
      return;
    }
    setTokens(data || []);
  }

  useEffect(() => {
    fetchPools();
    fetchTokens();
  }, []);

  const handleAddParticipant = () => {
    if (newParticipant.trim() === "") return;
    setParticipants([...participants, newParticipant]);
    setNewParticipant("");
  };

  const handleCreateDistribution = () => {
    console.log("Creating distribution:", {
      pool: selectedPool,
      address: distributionAddress,
      type: distributionType,
      details: distribution,
      participants_pool: participants,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 h-auto">
            <TabsTrigger
              value="create-pool"
              className={activeTab === "create-pool" ? "bg-green-300 " : ""}
            >
              Create Pool
            </TabsTrigger>
            <TabsTrigger
              value="send-vara"
              className={activeTab === "send-vara" ? "bg-green-300 " : ""}
            >
              Send Vara
            </TabsTrigger>
            <TabsTrigger
              value="create-distribution"
              className={activeTab === "create-distribution" ? "bg-green-300 " : ""}
            >
              Create Distribution
            </TabsTrigger>
            <TabsTrigger
              value="view-claim"
              className={activeTab === "view-claim" ? "bg-green-300 " : ""}
            >
              Claim
            </TabsTrigger>
            <TabsTrigger
              value="view-pools"
              className={activeTab === "view-pools" ? "bg-green-300 " : ""}
            >
              View Pools
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create-pool">
          <CreatePoolForm  fetchPools={fetchPools} />
        </TabsContent>


        <TabsContent value="send-vara">
          <SendVara pools={pools} />
        </TabsContent>
        <TabsContent value="create-distribution">
          <DistributionPoolBalance
            pools={pools}
      
          />
        </TabsContent>
        <TabsContent value="view-claim">
          <ClaimRewards
            pools={pools}
   
          />
        </TabsContent>
        <TabsContent value="view-pools">
          <ViewPools pools={pools} tokens={tokens} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
