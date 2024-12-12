'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApi, useAccount } from '@gear-js/react-hooks';
import { readState } from '@/hooks/api'
import { useProgramMetadata } from '@/hooks/api'
export function  Home() {
  const { isApiReady } = useApi();
  const { isAccountReady, account } = useAccount();
  const [poolName, setPoolName] = useState('')
  const [poolType, setPoolType] = useState('airdrop')
  const [initialAmount, setInitialAmount] = useState('')
  const [access, setAccess] = useState('public')
  const [distributionMode, setDistributionMode] = useState('manual')
  const [selectedPool, setSelectedPool] = useState('')
  const [participants, setParticipants] = useState<string[]>([]);
  const [distributionAddress, setDistributionAddress] = useState('')
  const [distributionType, setDistributionType] = useState('')
  const [distribution, setDistribution] = useState('')
  const [newParticipant, setNewParticipant] = useState('')
  console.log('../wasm/pool/pool.wasm')
  useProgramMetadata('./pool.meta.hex')

  const pools = [
    { id: '1', name: 'Pool 1', type: 'Airdrop', creator: '0x1234...5678', participants: 100, transactions: 50 },
    { id: '2', name: 'Pool 2', type: 'Rewards', creator: '0x8765...4321', participants: 75, transactions: 30 },
  ]

  const handleCreatePool = () => {
    try {

      const state = readState(account?.address || 'user');
      console.log('Estado del contrato leído:', state);
      // Haz algo con el estado leído
    } catch (error) {
      console.error('Error al leer el estado:', error);
    }
    console.log('Creating pool:', { poolName, poolType, initialAmount, access, distributionMode, participants })
  }

  const handleAddParticipant = () => {
    if (newParticipant.trim() === '') return;
    setParticipants([...participants, newParticipant.trim()]);
    setNewParticipant('');
  }
  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  }


  const handleCreateDistribution = () => {
    
    console.log('Creating distribution:', {
      pool: selectedPool,
      address: distributionAddress,
      type: distributionType,
      details: distribution,
      participants_pool: participants
    })
  }

  return (
    <div className="container mx-auto p-4">

      <h1 className="text-3xl font-bold mb-6">Dob Protocol UI</h1>
      <Tabs defaultValue="create-pool">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create-pool"   className="tabs-trigger"
          >Crear Pool</TabsTrigger>
          <TabsTrigger value="add-participants"   className="tabs-trigger"
          >Agregar Participantes</TabsTrigger>
          <TabsTrigger value="create-distribution"   className="tabs-trigger"
          >Crear Distribución</TabsTrigger>
          <TabsTrigger value="view-pools"   className="tabs-trigger"
          >Ver Pools</TabsTrigger>
        </TabsList>
        <TabsContent value="create-pool">
          <Card>
            <CardHeader>
              <CardTitle>Crear Pool</CardTitle>
              <CardDescription>Crea una nueva pool para el protocolo Dob.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pool-name">Nombre de la Pool</Label>
                <Input id="pool-name" value={poolName} onChange={(e) => setPoolName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Pool</Label>
                <RadioGroup value={poolType} onValueChange={setPoolType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="airdrop" id="airdrop" />
                    <Label htmlFor="airdrop">Airdrop</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rewards" id="rewards" />
                    <Label htmlFor="rewards">Rewards</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="participation" id="participation" />
                    <Label htmlFor="participation">Participación</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial-amount">Monto Inicial</Label>
                <Input 
                  id="initial-amount" 
                  type="number" 
                  value={initialAmount} 
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="Ingrese el monto inicial"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="access">Acceso</Label>
                <Select value={access} onValueChange={setAccess}>
                  <SelectTrigger id="access">
                    <SelectValue placeholder="Seleccione el tipo de acceso" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                </SelectContent>

                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distribution-mode">Modo de Distribución</Label>
                <Select value={distributionMode} onValueChange={setDistributionMode}>
                  <SelectTrigger id="distribution-mode">
                    <SelectValue placeholder="Seleccione el modo de distribución" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Participantes</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    placeholder="Agregar dirección"
                  />
                  <Button onClick={handleAddParticipant}>Agregar</Button>
                </div>
                <ul className="list-disc pl-6">
                  {participants.map((participant, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span>{participant}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveParticipant(index)}>
                        Eliminar
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreatePool}>Crear Pool</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="add-participants">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Participantes</CardTitle>
              <CardDescription>Agrega participantes a una pool existente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-pool">Seleccionar Pool</Label>
                <Select value={selectedPool} onValueChange={setSelectedPool}>
                  <SelectTrigger id="select-pool">
                    <SelectValue placeholder="Seleccione una pool" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    {pools.map((pool) => (
                      <SelectItem key={pool.id} value={pool.id}>{pool.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
              <Label htmlFor="participants">Direcciones de Participantes</Label>
                <Input 
                  id="participants" 
                  value={newParticipant} 
                  onChange={(e) => setNewParticipant(e.target.value)} 
                  placeholder="0x123..., 0x456..., ..." 
                />
              </div>
            </CardContent>
            <CardFooter>
            <Button onClick={handleAddParticipant} disabled={!selectedPool}>Agregar Participantes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="create-distribution">
          <Card>
            <CardHeader>
              <CardTitle>Crear Distribución</CardTitle>
              <CardDescription>Crea una nueva distribución para una pool existente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="distribution-pool">Seleccionar Pool</Label>
                <Select value={selectedPool} onValueChange={setSelectedPool}>
                  <SelectTrigger id="distribution-pool">
                    <SelectValue placeholder="Seleccione una pool" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    {pools.map((pool) => (
                      <SelectItem key={pool.id} value={pool.id}>{pool.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distribution-address">Dirección del Contrato de Distribución</Label>
                <Input 
                  id="distribution-address" 
                  value={distributionAddress} 
                  onChange={(e) => setDistributionAddress(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distribution-type">Tipo de Distribución</Label>
                <Select value={distributionType} onValueChange={setDistributionType}>
                  <SelectTrigger id="distribution-type">
                    <SelectValue placeholder="Seleccione el tipo de distribución" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem value="equal">Igual</SelectItem>
                    <SelectItem value="weighted">Ponderada</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distribution-details">Detalles de la Distribución</Label>
                <Input 
                  id="distribution-details" 
                  value={distribution} 
                  onChange={(e) => setDistribution(e.target.value)} 
                  placeholder="Formato: cantidad,dirección,..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateDistribution}
                disabled={!selectedPool || !distributionAddress || !distributionType}
              >
                Crear Distribución
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="view-pools">
          <Card>
            <CardHeader>
              <CardTitle>Pools Existentes</CardTitle>
              <CardDescription>Vista general de todas las pools creadas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Creador</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead>Transacciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pools.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell>{pool.name}</TableCell>
                      <TableCell>{pool.type}</TableCell>
                      <TableCell>{pool.creator}</TableCell>
                      <TableCell>{pool.participants}</TableCell>
                      <TableCell>{pool.transactions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

