import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePoolForm } from "@/components/PoolComponents/Create/CreatePool";
import { AddParticipantsForm } from "@/components/PoolComponents/Participants/Participants";
import { DistributionPoolBalance } from "@/components/PoolComponents/Distribution/DistributionPoolBalance";
import ViewPools from "@/components/PoolComponents/Pool/Details";
import { CONTRACT_DATA } from "@/app/consts";
import SailsCalls from "@/app/SailsCalls";
import { createClient } from "@supabase/supabase-js";
import { ClaimRewards } from "@/components/PoolComponents/Claim/ClaimPool";
const supabase = createClient("https://lwmvtiydijytxugorjrd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bXZ0aXlkaWp5dHh1Z29yanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDQ1ODcsImV4cCI6MjA1MDgyMDU4N30.hGCsLUY_N9RyJg0iebs5IgONMhKjv3lMgkuj_zcOZMY");


export const Pool = () => {
  const [pools2, setPool2] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("create-pool"); 
  const [poolName, setPoolName] = useState("");
  const [selectedPool, setSelectedPool] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [distributionAddress, setDistributionAddress] = useState("");
  const [distributionType, setDistributionType] = useState("");
  const [distribution, setDistribution] = useState("");
  const [newParticipant, setNewParticipant] = useState("");
  const [, setSailsCalls] = useState<SailsCalls | null>(null);
  async function getPools() {
    const { data } = await supabase.from("pools").select();
    setPool2(data || []);
  }
  const pools = [
    { id: "1", name: "Pool 1", type: "Airdrop", creator: "0x1234...5678", participants: 100, transactions: 50 },
    { id: "2", name: "Pool 2", type: "Rewards", creator: "0x8765...4321", participants: 75, transactions: 30 },
  ];
  useEffect(() => {
    getPools(); 

    const initSailsCalls = async () => {
      const instance = await SailsCalls.new({
        network: "wss://testnet.vara.network",
        idl: CONTRACT_DATA.idl,
      });
      setSailsCalls(instance);
      console.log("SailsCalls inicializado:", instance);
    };

    initSailsCalls().catch((err) => console.error("Error al inicializar SailsCalls:", err));
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
  console.log(pools2)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dob Protocol UI</h1>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="create-pool" className={activeTab === "create-pool" ? "bg-green-300 " : ""}>
            Create Pool
          </TabsTrigger>
          <TabsTrigger value="add-participants" className={activeTab === "add-participants" ? "bg-green-300 " : ""}>
            Added Participants
          </TabsTrigger>
          <TabsTrigger value="create-distribution" className={activeTab === "create-distribution" ? "bg-green-300 " : ""}>
            Create Distribution 
          </TabsTrigger>
          <TabsTrigger value="view-claim" className={activeTab === "view-claim" ? "bg-green-300 " : ""}>
            Claim
          </TabsTrigger>
          <TabsTrigger value="view-pools" className={activeTab === "view-pools" ? "bg-green-300 " : ""}>
            View Pools
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create-pool">
         <CreatePoolForm/>
        </TabsContent>
        <TabsContent value="add-participants">
          <AddParticipantsForm
            pools={pools}
            selectedPool={selectedPool}
            setSelectedPool={setSelectedPool}
            newParticipant={newParticipant}
            setNewParticipant={setNewParticipant}
            handleAddParticipant={handleAddParticipant}
          />
        </TabsContent>
        <TabsContent value="create-distribution">
          <DistributionPoolBalance
            pools={pools}
            selectedPool={selectedPool}
            setSelectedPool={setSelectedPool}
            distributionAddress={distributionAddress}
            setDistributionAddress={setDistributionAddress}
            distributionType={distributionType}
            setDistributionType={setDistributionType}
            distribution={distribution}
            setDistribution={setDistribution}
            handleCreateDistribution={handleCreateDistribution}
          />
        </TabsContent>
        <TabsContent value="view-claim">
          <ClaimRewards 
          pools={pools}
          selectedPool={selectedPool}
          setSelectedPool={setSelectedPool}
          handleClaimRewards={handleAddParticipant}

          />
        </TabsContent>
        <TabsContent value="view-pools">
          <ViewPools  />
        </TabsContent>
      </Tabs>
    </div>
  );
};
