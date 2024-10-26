import { graphql } from "@/gql";

export const receiptQuery = graphql(`
  query getReceipt($id: ID!) {
    receipt(id: $id) {
      id
      imagePath
      total
      merchantName
      matchingStore {
        id
        name
      }
      date
      items {
        ...ReceiptItem
      }
      scanned
    }
  }
`);
