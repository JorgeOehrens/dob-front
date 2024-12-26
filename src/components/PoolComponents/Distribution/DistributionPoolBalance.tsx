import { useEffect, useState } from "react";
import { useApi, useAlert, useAccount } from "@gear-js/react-hooks";
import { Button, Card, Center, Heading, VStack, Text } from "@chakra-ui/react";
import { useSailsCalls } from "@/app/hooks";
import SailsCalls from "@/app/SailsCalls";

function ReadState() {
  const { account } = useAccount();
  const sails = useSailsCalls();
  const alert = useAlert();

  const [fullState, setFullState] = useState<any | undefined>(0);


  const color = (fullState.current_light) ?? "Black";

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!sails) {
        alert.error('sails is not ready');
        return;
      }
  
      const response = await sails.query('Pool/DistributionPoolBalance');
  
      setFullState(response);
    }, 500);

    return () => clearInterval(intervalId);
  }, [sails])

  return (
    <Text>{JSON.stringify(fullState)}</Text>

  );
}

export { ReadState };
