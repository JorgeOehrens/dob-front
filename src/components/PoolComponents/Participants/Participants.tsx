

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface AddParticipantsFormProps {
  pools: any; // replace with specific type
  selectedPool: any; // replace with specific type
  setSelectedPool: (value: string) => void;
  newParticipant: any; // replace with specific type
  setNewParticipant: any; // replace with specific type
  handleAddParticipant: any; // replace with specific type
}
interface Pool {
  id: string; // or number, depending on your data
  name: string;
}
export const AddParticipantsForm = ({ pools, selectedPool, setSelectedPool, newParticipant, setNewParticipant, handleAddParticipant }: AddParticipantsFormProps) => (
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
              {pools.map((pool:Pool) => (
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
  );
  