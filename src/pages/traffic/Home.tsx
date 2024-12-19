import { 
  Center, 
  HStack, 
  VStack, 
} from "@chakra-ui/react";
import { ReadState } from "@/components/ReadState/ReadState";

export const Home = () => {
  return (
      <Center>
          <ReadState />
      </Center>
    );
};