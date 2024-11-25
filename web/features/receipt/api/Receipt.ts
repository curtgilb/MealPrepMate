import { graphql } from "@/gql";

export const receiptItemFragment = graphql(`
  fragment ReceiptItem on ReceiptLine {
    id
    totalPrice
    description
    quantity
    perUnitPrice
    unitQuantity
    foodType
    order
    verified
    ignore
    boundingBoxes {
      coordinates {
        x
        y
      }
    }
    matchingUnit {
      id
      name
    }
    matchingIngredient {
      id
      name
    }
  }
`);

const receiptQuery = graphql(`
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

const editReceiptItem = graphql(
  `
    mutation editReceiptItem($lineId: ID!, $lineItem: ReceiptItemInput!) {
      updateReceiptLine(lineId: $lineId, line: $lineItem) {
        ...ReceiptItem
      }
    }
  `
);

const finalizeReceiptMutation = graphql(`
  mutation finalizeReceipt($receiptId: ID!) {
    finalizeReceipt(receiptId: $receiptId) {
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

// export const editReceiptMutation = graphql(
//   `
//     mutation editReceipt($receiptId: String!, $receipt: UpdateReceipt!) {
//       updateReceipt(receipt: $receipt, receiptId: $receiptId) {
//         id
//         imagePath
//         total
//         merchantName
//         matchingStore {
//           id
//           name
//         }
//         date
//         items {
//           ...ReceiptItem
//         }
//         scanned
//       }
//     }
//   `
// );

export { receiptQuery, editReceiptItem, finalizeReceiptMutation };
