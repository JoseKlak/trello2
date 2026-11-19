import test from 'node:test';
import assert from 'node:assert/strict';
import { CloudBoard, connectCloud } from '../cloud.js';
test('cloud is disabled until real project configuration is available', async () => {
  assert.equal(await connectCloud({ url: '', publishableKey: '' }), null);
});
test('cloud reads existing document and saves with expected revision', async () => {
  let args;
  const client = {from: () => ({select: () => ({maybeSingle: async () => ({data:{document:{version:1},revision:4}})})}), rpc: async (name,input) => {args={name,input};return {data:5}}};
  const board = new CloudBoard(client);
  assert.deepEqual(await board.load(), {version:1});
  await board.save({version:1,cards:[]});
  assert.equal(args.input.expected_revision,4);
  assert.equal(board.revision,5);
  assert.equal(await board.changed(),true);
});
test('cloud rejects stale saves without advancing revision',async()=>{
  const board=new CloudBoard({rpc:async()=>({error:{code:'40001'}})});
  board.revision=2;
  await assert.rejects(board.save({version:1}),/CONFLICT/);
  assert.equal(board.revision,2);
});
