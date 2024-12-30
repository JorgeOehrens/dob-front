const codeId = '0x9a360c6ee3a4909d338f5cf46f2b09d6393dcd4e8867b2dde8ebc304d3e60ca9';
const meta = {
    name: 'MyProgram',
    type_pool: 'public',
    distribution_mode: 'even',
    access_type: 'restricted',
    owners: [
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    ],
    participants_pool: [
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    ],
    required: 2,
  };
  

const program = {
  codeId,
  gasLimit: 1000000,
  value: 1000,
};

const { programId, salt, extrinsic } = api.program.create(program, meta);

await extrinsic.signAndSend(keyring, (event) => {
  console.log(event.toHuman());
});