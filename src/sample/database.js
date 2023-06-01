import 'dotenv/config'; 
import * as GraphQL from 'graphql-request';

const graphQLClient = new GraphQL.GraphQLClient(process.env.HASURA_ENDPOINT, {
	headers: {
		'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
	}
})

/*
example args:

saveDesktopRequest({
    blockNumber: 123,
    chipSignature: '0x123',
    wallet_address: '0x123',
    pbt_contract_address: '0x456'
});

*/

export const saveDesktopRequest = async (args) => {
    const {blockNumber, chipSignature, pbt_contract_address, wallet_address} = args;

    const query = `
    mutation MyMutation($blockNumber: Int = 10, $chipSignature: String = "", $pbt_contract_address: String = "", $wallet_address: String = "") {
        insert_chipDesktopRequests(objects: {blockNumber: $blockNumber, chipSignature: $chipSignature, pbt_contract_address: $pbt_contract_address, wallet_address: $wallet_address}, on_conflict: {constraint: chipDesktopRequests_pkey, update_columns: [chipSignature,blockNumber]}) {
          affected_rows
        }
      }
    
  `;

  const variables = {
    blockNumber,
    chipSignature,
    pbt_contract_address,
    wallet_address
  }

    const response = await graphQLClient.request(query, variables, null);
    return response;
}

/*
example args:

getDesktopRequests({
    wallet_address: '0x123',
    pbt_contract_address: '0x456'
});

*/

export const getDesktopRequests = async (args) => {
    const {wallet_address, pbt_contract_address} = args;

    const query = `
        query MyQuery($pbt_contract_address: String = "", $wallet_address: String = "") {
                chipDesktopRequests(where: {pbt_contract_address: {_eq: $pbt_contract_address}, wallet_address: {_eq: $wallet_address}}) {
                blockNumber
                chipSignature
                pbt_contract_address
                wallet_address
            }
        }
      
    `;

    const variables = {
        pbt_contract_address,
        wallet_address
      }
    
    const response = await graphQLClient.request(query, variables, null);
    return response;
}