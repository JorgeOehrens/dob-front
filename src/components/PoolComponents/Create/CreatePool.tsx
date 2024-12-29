
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export const CreatePoolForm = ({ poolName, setPoolName, poolType, setPoolType, initialAmount, setInitialAmount, access, setAccess, distributionMode, setDistributionMode, participants, setParticipants, handleCreatePool, handleAddParticipant, handleRemoveParticipant, newParticipant, setNewParticipant }) => (
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
);