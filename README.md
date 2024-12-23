## DOB  frontend

To install the dependencies you need to put in the console: 

```bash
yarn
```

And to run the frontend you have to use:

```bash
yarn start
```

---

If you want to "build" the frontend, you need to use:

```bash
yarn build
```

To modify the contract id and IDL that you will use, open the file: src/app/consts.ts

There you will add your contract id and IDL, it will looks like this (you can use ContractSails interface): 

```javascript
export const CONTRACT_DATA: ContractSails = {
  programId: '0x40ee053ed5af803a3c68fa432e11a38c99422bbdec815bbf745d536077d7587a',
  idl: `
    type State = struct {
  name: str,
  type_pool: str,
  distribution_mode: str,
  access_type: str,
  transactions: vec struct { u256, Transaction },
  confirmations: vec struct { u256, vec actor_id },
  owners: vec actor_id,
  participants_pool: vec actor_id,
  required: u32,
  transaction_count: u256,
};

type Transaction = struct {
  destination: actor_id,
  payload: vec u8,
  value: u128,
  description: opt str,
  executed: bool,
};
 
constructor {
  New : (name: str, type_pool: str, distribution_mode: str, access_type: str, owners: vec actor_id, participants_pool: vec actor_id, required: u32);
};

service Pool {
  AddOwner : (owner: actor_id) -> null;
  AddParticipant : (participant: actor_id) -> null;
  ChangeRequiredConfirmationsCount : (count: u32) -> null;
  ConfirmTransaction : (transaction_id: u256) -> null;
  DistributionPool : (data: vec u8, total_value: u128, description: opt str) -> null;
  DistributionPool2 : (participants: vec actor_id, data: vec u8, total_value: u128, description: opt str) -> null;
  DistributionPoolBalance : (data: vec u8, description: opt str) -> null;
  ExecuteTransaction : (transaction_id: u256) -> null;
  RemoveOwner : (owner: actor_id) -> null;
  ReplaceOwner : (old_owner: actor_id, new_owner: actor_id) -> null;
  RevokeConfirmation : (transaction_id: u256) -> null;
  SubmitTransaction : (destination: actor_id, data: vec u8, value: u128, description: opt str) -> null;
  query GetState : () -> State;

  events {
    Confirmation: struct { sender: actor_id, transaction_id: u256 };
    Revocation: struct { sender: actor_id, transaction_id: u256 };
    Submission: struct { transaction_id: u256 };
    Execution: struct { transaction_id: u256 };
    OwnerAddition: struct { owner: actor_id };
    PaticipantAddition: struct { participant: actor_id };
    OwnerRemoval: struct { owner: actor_id };
    OwnerReplace: struct { old_owner: actor_id, new_owner: actor_id };
    RequirementChange: u256;
  }
};


  `
};
```

Then, yo have to go to the file: src/app.tsx

In the lines 17 to 21 you can set your contract id and IDL, it will looks like this:

```javascript
useInitSails({
    network: 'wss://testnet.vara.network',
    contractId: CONTRACT_DATA.programId,
    idl: CONTRACT_DATA.idl
});
```

This will initialize Sails in your frontend, or you can directly put the contract id and ILD in that part (useInitSails hook):

```javascript
useInitSails({
    network: 'wss://testnet.vara.network',
    contractId: '0x40ee053ed5af803a3c68fa432e11a38c99422bbdec815bbf745d536077d7587a',
    idl: `
        type IoTrafficLightState = struct {
        current_light: str,
            all_users: vec struct { actor_id, str },
        };

        type TrafficLightEvent = enum {
            Green,
            Yellow,
            Red,
        };

        constructor {
            New : ();
        };

        service Query {
            query TrafficLight : () -> IoTrafficLightState;
        };

        service TrafficLight {
            Green : () -> TrafficLightEvent;
            Red : () -> TrafficLightEvent;
            Yellow : () -> TrafficLightEvent;
        };
    `
});
```

Finally, for example you can go to 'src/components/TrafficLightComponents/GreenLightButton/Green-Color.tsx', where you will see this line of code (line 11): 

```javascript
const sails = useSailsCalls();
```

This will give you the instance of Sails that was created when it was initialized (you can use it in any other component). And in the same file, you will find two examples for its use:

```javascript
// Send a message:
const { signer } = await web3FromSource(accounts[0].meta.source);

const response = await sails.command(
    // 'Url': Service/Method
    'TrafficLight/Green',
    // Signer data
    {
        userAddress: account.decodedAddress,
        signer
    },
    {
        callbacks: {
            onLoad() { alert.info('Will send a message'); },
            onBlock(blockHash) { alert.success(`In block: ${blockHash}`); },
            onSuccess() { alert.success('Message send!'); },
            onError() { alert.error('Error while sending message'); }
        }
    }
);
const { signer } = await web3FromSource(account.meta.source);

console.log(`Response from contract: ${response}`);
```

```javascript
// Read state:
const response = await sails.query(
    'Query/TrafficLight',
    {
        userId: account.decodedAddress
    }
);

console.log(response);
```

You will find a large amount of examples of each method of SailsCalls in its documentation (its in the same frontend, yo only need to put your mouse over the method!) that will help you build your dApp!
