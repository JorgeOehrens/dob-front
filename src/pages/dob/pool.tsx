import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePoolForm } from "@/components/PoolComponents/Create/CreatePool";
import { AddParticipantsForm } from "@/components/PoolComponents/Participants/Participants";
import { DistributionPoolBalance } from "@/components/PoolComponents/Distribution/DistributionPoolBalance";
import ViewPools from "@/components/PoolComponents/Pool/Details";
import { CONTRACT_DATA } from "@/app/consts";
import {Program} from '../../../meta/src/lib';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import SailsCalls from "@/app/SailsCalls";

const fetchWasmCode = async () => {
  try {
    const response = await fetch('../../../../wasm/wasm.opt.wasm');
    if (!response.ok) {
      throw new Error('Error al cargar el archivo WASM');
    }
    const code = await response.arrayBuffer(); // Obtén el código como ArrayBuffer
    return new Uint8Array(code); // Convierte a Uint8Array si es necesario
  } catch (error) {
    console.error('Error al cargar el WASM:', error);
    return null;
  }
};
export const Pool = () => {
  const [activeTab, setActiveTab] = useState("create-pool"); 
  const [poolName, setPoolName] = useState("");
  const [poolType, setPoolType] = useState("airdrop");
  const [initialAmount, setInitialAmount] = useState("");
  const [access, setAccess] = useState("public");
  const [distributionMode, setDistributionMode] = useState("manual");
  const [selectedPool, setSelectedPool] = useState("");
  const [participants, setParticipants] = useState([]);
  const [distributionAddress, setDistributionAddress] = useState("");
  const [distributionType, setDistributionType] = useState("");
  const [distribution, setDistribution] = useState("");
  const [newParticipant, setNewParticipant] = useState("");
  const [sailsCalls, setSailsCalls] = useState(null);

  const pools = [
    { id: "1", name: "Pool 1", type: "Airdrop", creator: "0x1234...5678", participants: 100, transactions: 50 },
    { id: "2", name: "Pool 2", type: "Rewards", creator: "0x8765...4321", participants: 75, transactions: 30 },
  ];
  useEffect(() => {
    const initSailsCalls = async () => {
      const instance = await SailsCalls.new({
        network: "wss://testnet.vara.network", // Cambia esto según tu configuración
        idl: CONTRACT_DATA.idl, // Suponiendo que tienes un IDL válido
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
  const handleCreatePool = ()=>{
    console.log(poolName)

  };
  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
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
      <h1 className="text-3xl font-bold mb-6">Dob Protocol UI</h1>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create-pool" className={activeTab === "create-pool" ? "bg-green-300 " : ""}>
            Crear Pool
          </TabsTrigger>
          <TabsTrigger value="add-participants" className={activeTab === "add-participants" ? "bg-green-300 " : ""}>
            Agregar Participantes
          </TabsTrigger>
          <TabsTrigger value="create-distribution" className={activeTab === "create-distribution" ? "bg-green-300 " : ""}>
            Crear Distribución
          </TabsTrigger>
          <TabsTrigger value="view-pools" className={activeTab === "view-pools" ? "bg-green-300 " : ""}>
            Ver Pools
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create-pool">
          <CreatePoolForm
          
          />
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
        <TabsContent value="view-pools">
          <ViewPools pools={pools} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
